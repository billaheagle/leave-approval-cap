namespace my.leave;

using {
    Country,
    cuid,
    managed,
} from '@sap/cds/common';

type Status : String enum {
    Drafted = 'Drafted';
    Submitted = 'Submitted';
    InProgress = 'InProgress';
    Approved = 'Approved';
    Rejected = 'Rejected';
}

@odata.draft.enabled
entity Employees : cuid, managed {
    EmployeeNumber : String(10) not null default 'XXX-XXXXXX';
    FirstName      : String(40) not null;
    LastName       : String(40) not null;
    Email          : String(100) not null;
    Manager        : Association to Employees;
    CostCenter     : String(10) not null;
    Country        : Country not null;
    Active         : Boolean default true not null;
}

@odata.draft.enabled
entity LeaveTypes : cuid, managed {
    key Code        : String(10) not null;
        Description : String(50) not null;
        MaxDays     : Integer;
        Active      : Boolean default true not null;
}

@odata.draft.enabled
entity LeaveRequests : cuid, managed {
    RequestNumber  : String(15) not null default 'XX-XXXX-XXXXXXX';
    Reason         : String(255) not null;
    Employee       : Association to Employees not null;
    RequestDate    : DateTime not null;
    Status         : Status not null default #Drafted;
    IsClosed       : Boolean default false not null;
    LeaveApprovals : Composition of many LeaveApprovals
                         on LeaveApprovals.LeaveRequest = $self;
}

entity LeaveApprovals : cuid, managed {
    LeaveRequest : Association to LeaveRequests not null;
    Approver     : Association to Employees not null;
    Decision     : Status not null;
    ApprovalDate : DateTime;
    Comments     : String(255);
}
