using {my.leave as db} from '../../db/schema';

@requires: 'authenticated-user'
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

    entity LeaveTypes     as projection on db.LeaveTypes;

    entity Employees      as projection on db.Employees;
}
