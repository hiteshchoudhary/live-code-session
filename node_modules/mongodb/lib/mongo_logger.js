"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoLogger = exports.MongoLoggableComponent = exports.SeverityLevel = void 0;
const stream_1 = require("stream");
const utils_1 = require("./utils");
/** @internal */
exports.SeverityLevel = Object.freeze({
    EMERGENCY: 'emergency',
    ALERT: 'alert',
    CRITICAL: 'critical',
    ERROR: 'error',
    WARNING: 'warn',
    NOTICE: 'notice',
    INFORMATIONAL: 'info',
    DEBUG: 'debug',
    TRACE: 'trace',
    OFF: 'off'
});
/** @internal */
exports.MongoLoggableComponent = Object.freeze({
    COMMAND: 'command',
    TOPOLOGY: 'topology',
    SERVER_SELECTION: 'serverSelection',
    CONNECTION: 'connection'
});
/**
 * Parses a string as one of SeverityLevel
 *
 * @param s - the value to be parsed
 * @returns one of SeverityLevel if value can be parsed as such, otherwise null
 */
function parseSeverityFromString(s) {
    const validSeverities = Object.values(exports.SeverityLevel);
    const lowerSeverity = s?.toLowerCase();
    if (lowerSeverity != null && validSeverities.includes(lowerSeverity)) {
        return lowerSeverity;
    }
    return null;
}
/**
 * resolves the MONGODB_LOG_PATH and mongodbLogPath options from the environment and the
 * mongo client options respectively.
 *
 * @returns the Writable stream to write logs to
 */
function resolveLogPath({ MONGODB_LOG_PATH }, { mongodbLogPath }) {
    const isValidLogDestinationString = (destination) => ['stdout', 'stderr'].includes(destination.toLowerCase());
    if (typeof mongodbLogPath === 'string' && isValidLogDestinationString(mongodbLogPath)) {
        return mongodbLogPath.toLowerCase() === 'stderr' ? process.stderr : process.stdout;
    }
    // TODO(NODE-4813): check for minimal interface instead of instanceof Writable
    if (typeof mongodbLogPath === 'object' && mongodbLogPath instanceof stream_1.Writable) {
        return mongodbLogPath;
    }
    if (typeof MONGODB_LOG_PATH === 'string' && isValidLogDestinationString(MONGODB_LOG_PATH)) {
        return MONGODB_LOG_PATH.toLowerCase() === 'stderr' ? process.stderr : process.stdout;
    }
    return process.stderr;
}
/** @internal */
class MongoLogger {
    constructor(options) {
        this.componentSeverities = options.componentSeverities;
        this.maxDocumentLength = options.maxDocumentLength;
        this.logDestination = options.logDestination;
    }
    /* eslint-disable @typescript-eslint/no-unused-vars */
    /* eslint-disable @typescript-eslint/no-empty-function */
    emergency(component, message) { }
    alert(component, message) { }
    critical(component, message) { }
    error(component, message) { }
    warn(component, message) { }
    notice(component, message) { }
    info(component, message) { }
    debug(component, message) { }
    trace(component, message) { }
    /**
     * Merges options set through environment variables and the MongoClient, preferring environment
     * variables when both are set, and substituting defaults for values not set. Options set in
     * constructor take precedence over both environment variables and MongoClient options.
     *
     * @remarks
     * When parsing component severity levels, invalid values are treated as unset and replaced with
     * the default severity.
     *
     * @param envOptions - options set for the logger from the environment
     * @param clientOptions - options set for the logger in the MongoClient options
     * @returns a MongoLoggerOptions object to be used when instantiating a new MongoLogger
     */
    static resolveOptions(envOptions, clientOptions) {
        // client options take precedence over env options
        const combinedOptions = {
            ...envOptions,
            ...clientOptions,
            mongodbLogPath: resolveLogPath(envOptions, clientOptions)
        };
        const defaultSeverity = parseSeverityFromString(combinedOptions.MONGODB_LOG_ALL) ?? exports.SeverityLevel.OFF;
        return {
            componentSeverities: {
                command: parseSeverityFromString(combinedOptions.MONGODB_LOG_COMMAND) ?? defaultSeverity,
                topology: parseSeverityFromString(combinedOptions.MONGODB_LOG_TOPOLOGY) ?? defaultSeverity,
                serverSelection: parseSeverityFromString(combinedOptions.MONGODB_LOG_SERVER_SELECTION) ?? defaultSeverity,
                connection: parseSeverityFromString(combinedOptions.MONGODB_LOG_CONNECTION) ?? defaultSeverity,
                default: defaultSeverity
            },
            maxDocumentLength: (0, utils_1.parseUnsignedInteger)(combinedOptions.MONGODB_LOG_MAX_DOCUMENT_LENGTH) ?? 1000,
            logDestination: combinedOptions.mongodbLogPath
        };
    }
}
exports.MongoLogger = MongoLogger;
//# sourceMappingURL=mongo_logger.js.map