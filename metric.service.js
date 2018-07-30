'use strict';

module.exports = {
    // Service function to remove metrics that are older than a specific time in seconds
    removeMetricOlderGivenTime: (metrics, key, timeLimitInSeconds) => {
        // If key doesn't exists in metrics simply return original metrics object
        // Else...
        if (key in metrics) {
            // Get the time frame where we want to judge when the cutoff point is
            let currentTimestamp = Math.floor(Date.now() / 1000);
            let oneHourAgo = currentTimestamp - timeLimitInSeconds;

            // Instantiate an index where we want to keep the metrics and rid the rest
            let indexToSlice = 0;

            // Loop through metric of specific key to see when metric is inside of the time limit and get index
            for (let i = 0; i < metrics[key].length; i++) {
                if (metrics[key][i].time_created >= oneHourAgo) {
                    indexToSlice = i;
                    break;
                }

                // EDGE CASE: In case every metric is over the time limit, then we need to rid of all data for this key
                // This simply checks if is on the last element of the loop and no metric has been found within the time
                // Limit
                if (i === metrics[key].length - 1) {
                    metrics[key] = [];
                    return metrics;
                }
            }

            // Slice the metric of specific key with the found index
            metrics[key] = metrics[key].slice(indexToSlice);
        }

        // Return metric object
        return metrics;
    },
    /**
     * Function to get rounded sum of metric values
     *
     * @param metrics
     * @param key
     * @returns {number}
     */
    getMetricValueByKey: (metrics, key) => {
        let metricSum = 0;

        // Iterate through the metric data by key to find the total value
        for (let i = 0; i < metrics[key].length; i++) {
            metricSum += metrics[key][i].value;
        }

        // Return a rounded sum of the metric by key
        return Math.round(metricSum);
    },
    /**
     * Validates against invalid values for metrics
     *
     * @param value
     * @returns {boolean}
     */
    validateValue: (value) => {
        // If value is undefined, return false
        if (value === undefined || value === 'undefined') {
            return false;
        }

        // If value is not a number such as boolean or string
        if (isNaN(value)) {
            return false;
        }

        // If value is negative or 0, we want to prevent it from being entered
        // NOTE: This was a decision on my part as the prompt didn't have an opinion on it
        return value > 0;
    }
};
