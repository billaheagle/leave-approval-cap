using {my.leave as db} from '../../db/schema';

service LeaveService {
    @odata.draft.enabled
    entity LeaveRequests  as
        projection on db.LeaveRequests {
            *,
            LeaveApprovals
        }
        
        actions {
            action submit()                  returns {
                Status : String;
            };

            action approve(Comments: String) returns {
                Status : String;
            };

            action reject(Comments: String)  returns {
                Status : String;
            };
        };

    entity LeaveApprovals as projection on db.LeaveApprovals;
}
