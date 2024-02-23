"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = void 0;
/**
 * Importing the required modules for dependency injection and cache handling.
 */
require("reflect-metadata");
const inversify_1 = require("inversify");
const LockMap_1 = require("../Cache/LockMap");
/**
 * Creating a new Inversify IoC (Inversion of Control) container.
 * @remarks
 * The IoC container will be used for dependency injection.
 */
const container = new inversify_1.Container();
exports.container = container;
/**
 * Binding the 'cacheLockMap' token to the TableLockHashMap class in the IoC container.
 * @remarks
 * The 'inSingletonScope()' indicates that a single instance of TableLockHashMap will be shared across the application.
 */
container.bind('cacheLockMap').to(LockMap_1.TableLockHashMap).inSingletonScope();
