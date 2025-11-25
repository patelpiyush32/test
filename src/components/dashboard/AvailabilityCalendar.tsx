import { useState, useEffect } from 'react';
import { supabase, Room, Availability } from '../../lib/supabase';
import { Calendar, DollarSign, Lock, Unlock } from 'lucide-react';

type AvailabilityCalendarProps = {
  hotelId: string;
};

export default function AvailabilityCalendar({ hotelId }: AvailabilityCalendarProps) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availability, setAvailability] = useState<Record<string, Availability>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRooms();
  }, [hotelId]);

  useEffect(() => {
    if (selectedRoom) {
      loadAvailability();
    }
  }, [selectedRoom, currentMonth]);

  const loadRooms = async () => {
    const { data } = await supabase
      .from('rooms')
      .select('*')
      .eq('hotel_id', hotelId);
    if (data && data.length > 0) {
      setRooms(data);
      setSelectedRoom(data[0].id);
    }
    setLoading(false);
  };

  const loadAvailability = async () => {
    const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const endDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

    const { data } = await supabase
      .from('availability')
      .select('*')
      .eq('room_id', selectedRoom)
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', endDate.toISOString().split('T')[0]);

    const availMap: Record<string, Availability> = {};
    data?.forEach(a => {
      availMap[a.date] = a;
    });
    setAvailability(availMap);
  };

  const toggleAvailability = async (date: string) => {
    const existing = availability[date];
    if (existing) {
      await supabase
        .from('availability')
        .update({ is_available: !existing.is_available })
        .eq('id', existing.id);
    } else {
      await supabase
        .from('availability')
        .insert({
          room_id: selectedRoom,
          date,
          is_available: false
        });
    }
    loadAvailability();
  };

  const updatePrice = async (date: string, price: number | null) => {
    const existing = availability[date];
    if (existing) {
      await supabase
        .from('availability')
        .update({ price_override: price })
        .eq('id', existing.id);
    } else {
      await supabase
        .from('availability')
        .insert({
          room_id: selectedRoom,
          date,
          price_override: price
        });
    }
    loadAvailability();
  };

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const selectedRoomData = rooms.find(r => r.id === selectedRoom);
  const days = getDaysInMonth();

  if (loading) {
    return <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Availability Calendar</h3>
          <p className="text-sm text-gray-600">Manage room availability and pricing</p>
        </div>
        <select
          value={selectedRoom}
          onChange={(e) => setSelectedRoom(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
        >
          {rooms.map(room => (
            <option key={room.id} value={room.id}>{room.title}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            ← Previous
          </button>
          <h4 className="text-lg font-semibold">
            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h4>
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            Next →
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-semibold text-gray-700 py-2">
              {day}
            </div>
          ))}

          {days.map((date, idx) => {
            if (!date) return <div key={idx} />;
            
            const dateStr = formatDate(date);
            const avail = availability[dateStr];
            const isAvailable = avail ? avail.is_available : true;
            const priceOverride = avail?.price_override;
            const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));

            return (
              <div
                key={idx}
                className={`border rounded-lg p-2 min-h-[80px] ${
                  isPast ? 'bg-gray-100' : isAvailable ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-sm font-medium">{date.getDate()}</span>
                  {!isPast && (
                    <button
                      onClick={() => toggleAvailability(dateStr)}
                      className="text-xs"
                    >
                      {isAvailable ? <Unlock className="h-3 w-3 text-green-600" /> : <Lock className="h-3 w-3 text-red-600" />}
                    </button>
                  )}
                </div>
                {!isPast && (
                  <input
                    type="number"
                    placeholder={`₹${selectedRoomData?.price || 0}`}
                    value={priceOverride || ''}
                    onChange={(e) => updatePrice(dateStr, e.target.value ? parseFloat(e.target.value) : null)}
                    className="w-full text-xs px-1 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-600 outline-none"
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-50 border border-green-200 rounded"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-50 border border-red-200 rounded"></div>
            <span>Blocked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
            <span>Past</span>
          </div>
        </div>
      </div>
    </div>
  );
}
