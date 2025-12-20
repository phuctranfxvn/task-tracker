import React from 'react';
import { Gift, Clock, Sun, ChevronRight } from 'lucide-react';

const RightPanel = ({ t, upcomingTasks, processedBirthdays, lang, openEditModal, userProfile }) => {

    // Helper to format date
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        const locale = lang === 'vi' ? 'vi-VN' : 'en-US';
        return d.toLocaleDateString(locale, { day: 'numeric', month: 'short' });
    };

    // Weather Condition Mapping
    const getWeatherDescription = (code) => {
        if (code === 0) return t('weather_clear') || 'Clear Sky';
        if (code >= 1 && code <= 3) return t('weather_cloudy') || 'Cloudy';
        if ((code >= 45 && code <= 48) || (code >= 51 && code <= 57)) return t('weather_fog') || 'Fog/Drizzle';
        if (code >= 61 && code <= 67) return t('weather_rain') || 'Rain';
        if (code >= 71 && code <= 77) return t('weather_snow') || 'Snow';
        if (code >= 80 && code <= 82) return t('weather_rain_showers') || 'Rain Showers';
        if (code >= 95 && code <= 99) return t('weather_thunderstorm') || 'Thunderstorm';
        return t('weather_unknown') || 'Unknown';
    };

    const [weather, setWeather] = React.useState({ temp: '--', city: 'Ho Chi Minh', sub: 'Vietnam', condition: '--', min: '--', max: '--' });

    // Coordinate Mapping
    const CITY_COORDS = {
        "Ho Chi Minh": { lat: 10.8231, lon: 106.6297 },
        "Ha Noi": { lat: 21.0285, lon: 105.8542 },
        "Da Nang": { lat: 16.0544, lon: 108.2022 },
        "Can Tho": { lat: 10.0452, lon: 105.7469 }
    };

    React.useEffect(() => {
        let locationName = userProfile?.location || 'Ho Chi Minh';
        const coords = CITY_COORDS[locationName] || CITY_COORDS['Ho Chi Minh'];
        const { lat, lon } = coords;

        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,is_day,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=Asia%2FBangkok`)
            .then(res => res.json())
            .then(data => {
                if (data.current && data.daily) {
                    setWeather({
                        temp: Math.round(data.current.temperature_2m),
                        city: locationName,
                        sub: 'Vietnam',
                        condition: getWeatherDescription(data.current.weather_code),
                        max: Math.round(data.daily.temperature_2m_max[0]),
                        min: Math.round(data.daily.temperature_2m_min[0])
                    });
                }
            })
            .catch(err => console.error("Weather fetch error:", err));
    }, [lang, userProfile]); // Re-run if userProfile changes


    return (
        <div className="d-flex flex-column h-100 bg-white p-4 shadow-soft" style={{ width: '300px', borderRadius: '24px 0 0 24px', zIndex: 10 }}>
            {/* Header / Date */}
            <div className="d-flex justify-content-between align-items-start mb-5">
                <div>
                    <h6 className="fw-bold mb-0 text-dark">{weather.city}</h6>
                    <div className="text-muted small">{weather.sub}</div>
                </div>
                <div className="text-end">
                    <div className="d-flex align-items-center justify-content-end gap-2 text-warning">
                        <Sun size={28} />
                        <div className="display-6 fw-bold">{weather.temp}°C</div>
                    </div>
                    <div className="text-muted small fw-medium">{weather.condition}</div>
                    <div className="text-muted extra-small fw-bold mt-1">
                        H: {weather.max}° L: {weather.min}°
                    </div>
                </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className="mb-4 flex-grow-1 overflow-hidden d-flex flex-column">
                <h6 className="fw-bold text-dark mb-3">Task Prediction</h6>

                <div className="d-flex flex-column gap-3 overflow-auto custom-scrollbar flex-grow-1 pe-2">
                    {upcomingTasks.length === 0 && <div className="text-muted small fst-italic">No upcoming tasks</div>}
                    {upcomingTasks.slice(0, 5).map(task => (
                        <div key={task.id} className="p-3 rounded-lg bg-light d-flex align-items-center gap-3 cursor-pointer" onClick={() => openEditModal(task)}>
                            <div className="bg-white rounded-circle p-2 shadow-sm text-primary">
                                <Clock size={16} />
                            </div>
                            <div className="flex-grow-1" style={{ minWidth: 0 }}>
                                <div className="fw-bold text-dark text-truncate small">{task.description}</div>
                                <div className="text-muted" style={{ fontSize: '0.7rem' }}>{formatDate(task.due_date)}</div>
                            </div>
                            <div className="text-warning fw-bold small">
                                {task.priority === 'High' && 'High'}
                            </div>
                        </div>
                    ))}
                </div>
            </div>


        </div>
    );
};

export default RightPanel;
