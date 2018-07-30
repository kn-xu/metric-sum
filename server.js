'use strict';

// Get routing library express
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Enable body parser for getting post parameters
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Grab service file and instantiate in memory js object to hold all metric information
const metricService = require('./metric.service');

// I used var instead of const because this value will change over time
var sumOfMetrics = {};

/**
 * Parameters for application
 *
 * @type {number}
 */
// Time limit of where the cutoff is, we want 1 hour in this example, but can be changed and stored as a parameter if used
// In a more robust application
const timeLimit = 3600;

// Port number of the application we want to use
const portNumber = 3000;

/**
 * Routing using Express
 */
app.listen(portNumber, () => {
    /**
     * Get request of metric values per key
     *
     * @param key string
     */
    app.get('/metric/:key/sum', (req, res) => {
        // Service function to strip away old requests that were past an hour ago
        sumOfMetrics = metricService.removeMetricOlderGivenTime(sumOfMetrics, req.params.key, timeLimit);

        // Get the value from the sumOfMetrics object with the key unless key doesn't exist, just return 0 instead
        // We also round the number to the nearest integer
        let metricValue = req.params.key in sumOfMetrics ? metricService.getMetricValueByKey(sumOfMetrics, req.params.key) : 0;

        // JSON response with value and metric value
        res.json({
            value: metricValue
        });
    });

    /**
     * Post request to add a metric value to a specific key
     *
     * @param key string
     */
    app.post('/metric/:key', (req, res) => {
        // We want to validate the value to ensure the number entered isn't invalid
        if (!metricService.validateValue(req.body.value)) {
            res.status(500).send('Invalid value of metric');
            return;
        }

        // Service function to strip away old requests that were past an hour ago
        sumOfMetrics = metricService.removeMetricOlderGivenTime(sumOfMetrics, req.params.key, timeLimit);

        // Create metric object to be stored
        let currentMetric = {
            value: Number(req.body.value),
            time_created: Math.floor(Date.now() / 1000)
        };

        // Try catch block in case of errors, then send 500 error noting of such error
        try {
            // Key already exists, we simply want to add another metric to it
            // Else, create key in object and set it to an array of the current timestamp denoting a value of 1
            if (req.params.key in sumOfMetrics) {
                sumOfMetrics[req.params.key].push(currentMetric);
            } else {
                sumOfMetrics[req.params.key] = [currentMetric];
            }
        } catch (err) {
            res.status(500).send('Issue adding to metric with key: ' + req.params.key);
        }

        // If no error, return with empty json object
        res.send({});
    });
});
