
import 'reflect-metadata';
import { Container } from 'inversify';
import { TableLockHashMap } from '../Cache/LockMap';


const container = new Container();


container.bind<TableLockHashMap>('cacheLockMap').to(TableLockHashMap).inSingletonScope();


export { container };
