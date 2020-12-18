/* istanbul ignore file */

import { NodeTracerProvider } from '@opentelemetry/node';
import { SimpleSpanProcessor } from '@opentelemetry/tracing';
import { ZipkinExporter } from '@opentelemetry/exporter-zipkin';
import { EventEmitter } from 'events';

if (+(process.env.ENABLE_TRACING || 0)) {
    const provider = new NodeTracerProvider({
        plugins: {
            express: {},
            http: {},
            https: {},
        },
    });

    if (process.env.ZIPKIN_ENDPOINT) {
        const zipkinExporter = new ZipkinExporter({
            url: process.env.ZIPKIN_ENDPOINT,
            serviceName: 'psb-api-ipgeo',
        });

        const zipkinProcessor = new SimpleSpanProcessor(zipkinExporter);
        provider.addSpanProcessor(zipkinProcessor);
    }

    provider.register();
    EventEmitter.defaultMaxListeners = 20;
}
