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
                Status        : String;
                RequestNumber : String;
            };

            action approve(Comments: String) returns {
                Status        : String;
                IsClosed      : Boolean;
                CurrentStepNo : Integer;
            };

            action reject(Comments: String)  returns {
                Status        : String;
                IsClosed      : Boolean;
            };
        };

    entity LeaveApprovals as projection on db.LeaveApprovals;
}
