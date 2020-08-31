(async function() { // async fn to block html processing until all scripts are loaded
    // js files to be served. FILE ORDER MUST BE PERSEVERED!
    const files = [
        'highcharts-gantt.js',
        'logisticsSVG.js',
        'logisticsUtils.js',
        'logisticsEvents.js',
        'highstock.js',
        'draggable-points.js',
        'custom-event-dblclick.js',
        'logistics-module.js',
        'exporting.js'
    ];

    const filePrefix = 'http://localhost:8125/'; // port must be the same as defined in file-server.js
    const versionSuffix = Date.now(); // set version suffix to prevent script caching

    const scripts = files.map(file => {
        const script = document.createElement('script');

        // set necessary attributes
        script.setAttribute('src', `${filePrefix}${file}?v${versionSuffix}`);
        script.setAttribute('type', 'text/javascript');

        return script;
    });

    const length = scripts.length;
    const lastIndex = length - 1;

    for (let i = 0; i < length; i++) {
        if (i !== lastIndex) {
            scripts[i].onload = () => document.head.appendChild(scripts[i + 1]); // chain script loading
        }
    }

    return new Promise(resolve => {
        const lastScript = scripts[lastIndex];
        lastScript.onload = () => resolve(); // last script load resolves promise

        document.head.appendChild(scripts[0]);
    });
})();
