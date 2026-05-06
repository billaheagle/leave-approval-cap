using {my.leave as db} from '../../db/schema';

@path: 'master-data'
service MasterDataService {
    @odata.draft.enabled
    entity Employees  as projection on db.Employees;

    @odata.draft.enabled
    entity LeaveTypes as projection on db.LeaveTypes;
}
