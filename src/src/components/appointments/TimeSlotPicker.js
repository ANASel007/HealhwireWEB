import React, { useState, useEffect } from 'react';
import { format, addDays, isSameDay } from 'date-fns';
import { FiChevronLeft, FiChevronRight, FiClock } from 'react-icons/fi';
import axios from '@/lib/axios';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export const TimeSlotPicker = ({ doctorId, onSelectTimeSlot, selectedDate, selectedTime }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [dateRange, setDateRange] = useState([]);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Generate date range (7 days from current date)
    useEffect(() => {
        const generateDateRange = () => {
            const range = [];
            for (let i = 0; i < 7; i++) {
                range.push(addDays(currentDate, i));
            }
            return range;
        };

        setDateRange(generateDateRange());
    }, [currentDate]);

    // Fetch available time slots when doctor or date changes
    useEffect(() => {
        if (!doctorId || !selectedDate) return;

        const fetchAvailableSlots = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const formattedDate = format(selectedDate, 'yyyy-MM-dd');
                const response = await axios.get(
                    `/appointments/available/${doctorId}?date=${formattedDate}`
                );
                setAvailableSlots(response.data.availableSlots || []);
            } catch (err) {
                setError('Failed to load available time slots');
                console.error('Error fetching available slots:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAvailableSlots();
    }, [doctorId, selectedDate]);

    const handlePreviousWeek = () => {
        setCurrentDate(addDays(currentDate, -7));
    };

    const handleNextWeek = () => {
        setCurrentDate(addDays(currentDate, 7));
    };

    const handleDateSelect = (date) => {
        onSelectTimeSlot(date, null);
    };

    const handleTimeSelect = (time) => {
        onSelectTimeSlot(selectedDate, time);
    };

    const isDateSelected = (date) => {
        return selectedDate && isSameDay(date, selectedDate);
    };

    const isTimeSelected = (time) => {
        return selectedTime === time;
    };

    return (
        <Card>
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-secondary-900 dark:text-white">
                        Select Date
                    </h3>
                    <div className="flex space-x-2">
                        <Button
                            variant="outline"
                            className="p-2"
                            onClick={handlePreviousWeek}
                            aria-label="Previous week"
                        >
                            <FiChevronLeft className="h-5 w-5" />
                        </Button>
                        <Button
                            variant="outline"
                            className="p-2"
                            onClick={handleNextWeek}
                            aria-label="Next week"
                        >
                            <FiChevronRight className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-2">
                    {dateRange.map((date, index) => (
                        <button
                            key={index}
                            className={`
                flex flex-col items-center justify-center p-2 rounded-md border
                ${
                                isDateSelected(date)
                                    ? 'bg-primary-100 border-primary-500 text-primary-800 dark:bg-primary-900 dark:border-primary-400 dark:text-primary-100'
                                    : 'border-secondary-200 hover:bg-secondary-50 dark:border-secondary-700 dark:hover:bg-secondary-700'
                            }
              `}
                            onClick={() => handleDateSelect(date)}
                        >
              <span className="text-xs font-medium text-secondary-500 dark:text-secondary-400">
                {format(date, 'EEE')}
              </span>
                            <span
                                className={`text-lg font-semibold ${
                                    isDateSelected(date)
                                        ? 'text-primary-800 dark:text-primary-100'
                                        : 'text-secondary-900 dark:text-white'
                                }`}
                            >
                {format(date, 'd')}
              </span>
                            <span className="text-xs text-secondary-500 dark:text-secondary-400">
                {format(date, 'MMM')}
              </span>
                        </button>
                    ))}
                </div>
            </div>

            {selectedDate && (
                <div>
                    <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-4">
                        Select Time for {format(selectedDate, 'EEEE, MMMM d')}
                    </h3>

                    {isLoading ? (
                        <div className="flex justify-center py-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
                        </div>
                    ) : error ? (
                        <div className="text-red-500 text-sm py-2">{error}</div>
                    ) : availableSlots.length === 0 ? (
                        <div className="text-secondary-500 dark:text-secondary-400 py-4 text-center">
                            No available time slots for this date. Please select another date.
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                            {availableSlots.map((time, index) => (
                                <button
                                    key={index}
                                    className={`
                    flex items-center justify-center p-3 rounded-md border
                    ${
                                        isTimeSelected(time)
                                            ? 'bg-primary-100 border-primary-500 text-primary-800 dark:bg-primary-900 dark:border-primary-400 dark:text-primary-100'
                                            : 'border-secondary-200 hover:bg-secondary-50 dark:border-secondary-700 dark:hover:bg-secondary-700'
                                    }
                  `}
                                    onClick={() => handleTimeSelect(time)}
                                >
                                    <FiClock className="mr-1 h-4 w-4" />
                                    <span>{time}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </Card>
    );
};