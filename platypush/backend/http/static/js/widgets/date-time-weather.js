$(document).ready(function() {
    var $widget = $('.widget.date-time-weather'),
        $dateElement = $widget.find('[data-bind=date]'),
        $timeElement = $widget.find('[data-bind=time]'),
        $forecastElement = $widget.find('[data-bind=forecast]'),
        $tempElement = $widget.find('[data-bind=temperature]');

    var onEvent = function(event) {
        if (event.args.type == 'platypush.message.event.weather.NewWeatherConditionEvent') {
            updateTemperature(event.args.temperature);
        }
    };

    var updateTemperature = function(temperature) {
        $tempElement.text(Math.round(temperature));
    };

    var initEvents = function() {
        window.registerEventListener(onEvent);
    };

    var refreshDateTime = function() {
        var now = new Date();
        $dateElement.text(now.toDateString());
        $timeElement.text(now.getHours() + ':' +
            (now.getMinutes() < 10 ? '0' : '') + now.getMinutes() + ':' +
            (now.getSeconds() < 10 ? '0' : '') + now.getSeconds());
    };


    var initWeather = function() {
        execute(
            {
                type: 'request',
                action: 'weather.forecast.get_current_weather',
            },

            onSuccess = function(response) {
                updateTemperature(status=response.response.output.temperature);
            }
        );
    };

    var refreshForecast = function() {
        execute(
            {
                type: 'request',
                action: 'weather.forecast.get_hourly_forecast',
            },

            onSuccess = function(response) {
                $forecastElement.text(response.response.output.summary);
            }
        );
    };

    var initWidget = function() {
        refreshDateTime();
        setInterval(refreshDateTime, 500);
        refreshForecast();
        setInterval(refreshForecast, 1200000);
        initWeather();
    };

    var init = function() {
        initEvents();
        initWidget();
    };

    init();
});
