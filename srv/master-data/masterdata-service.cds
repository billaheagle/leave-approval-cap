using {my.leave as db} from '../../db/schema';

@path: 'master-data'
service MasterDataService {
    entity Employees  as projection on db.Employees;
    entity LeaveTypes as projection on db.LeaveTypes;
}
