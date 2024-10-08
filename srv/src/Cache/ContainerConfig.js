"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = void 0;
require("reflect-metadata");
const inversify_1 = require("inversify");
const LockMap_1 = require("../Cache/LockMap");
const container = new inversify_1.Container();
exports.container = container;
container.bind('cacheLockMap').to(LockMap_1.TableLockHashMap).inSingletonScope();
