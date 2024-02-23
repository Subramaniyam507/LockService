/**
 * Importing the required modules for dependency injection and cache handling.
 */
import 'reflect-metadata';
import { Container } from 'inversify';
import { TableLockHashMap } from '../Cache/LockMap';

/**
 * Creating a new Inversify IoC (Inversion of Control) container.
 * @remarks
 * The IoC container will be used for dependency injection.
 */
const container = new Container();

/**
 * Binding the 'cacheLockMap' token to the TableLockHashMap class in the IoC container.
 * @remarks
 * The 'inSingletonScope()' indicates that a single instance of TableLockHashMap will be shared across the application.
 */
container.bind<TableLockHashMap>('cacheLockMap').to(TableLockHashMap).inSingletonScope();

/**
 * Exporting the configured IoC container to be used throughout the application for dependency injection.
 */
export { container };
