using LeaveService from './leave-service';

annotate LeaveService.LeaveRequests with {
    RequestNumber @Core.Computed;
    Status        @Core.Computed;
    IsClosed      @Core.Computed;
    Employee      @Core.Computed;
    RequestDate   @Core.Computed;
};

annotate LeaveService.LeaveRequests with @(
    UI.HeaderInfo                  : {
        TypeName      : 'Leave Request',
        TypeNamePlural: 'Leave Requests',
        Title         : {
            $Type: 'UI.DataField',
            Value: RequestNumber
        },
        Description   : {
            $Type: 'UI.DataField',
            Value: Status
        }
    },

    UI.SelectionFields             : [
        RequestNumber,
        Status,
        Employee_ID,
        LeaveType_ID,
        RequestDate
    ],

    Capabilities.FilterRestrictions: {FilterExpressionRestrictions: [{
        Property          : RequestDate,
        AllowedExpressions: 'SingleRange'
    }]},

    UI.LineItem                    : [
        {
            $Type: 'UI.DataField',
            Value: RequestNumber,
            Label: 'Request Number'
        },
        {
            $Type: 'UI.DataField',
            Value: Employee.EmployeeNumber,
            Label: 'Employee'
        },
        {
            $Type: 'UI.DataField',
            Value: LeaveType.Description,
            Label: 'Leave Type'
        },
        {
            $Type: 'UI.DataField',
            Value: RequestDate,
            Label: 'Request Date'
        },
        {
            $Type: 'UI.DataField',
            Value: Status,
            Label: 'Status'
        },
        {
            $Type: 'UI.DataField',
            Value: IsClosed,
            Label: 'Closed'
        }
    ],

    UI.Facets                      : [
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'General Information',
            Target: '@UI.FieldGroup#General'
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Approval History',
            Target: 'LeaveApprovals/@UI.LineItem'
        }
    ],

    UI.FieldGroup #General         : {Data: [
        {
            $Type: 'UI.DataField',
            Value: RequestNumber,
            Label: 'Request Number'
        },
        {
            $Type: 'UI.DataField',
            Value: Employee_ID,
            Label: 'Employee'
        },
        {
            $Type: 'UI.DataField',
            Value: LeaveType_ID,
            Label: 'Leave Type'
        },
        {
            $Type: 'UI.DataField',
            Value: Reason,
            Label: 'Reason'
        },
        {
            $Type: 'UI.DataField',
            Value: RequestDate,
            Label: 'Request Date'
        },
        {
            $Type: 'UI.DataField',
            Value: Status,
            Label: 'Status'
        },
        {
            $Type: 'UI.DataField',
            Value: IsClosed,
            Label: 'Closed'
        }
    ]}
);

annotate LeaveService.LeaveRequests with @(UI.Identification: [
    {
        $Type : 'UI.DataFieldForAction',
        Action: 'LeaveService.submit',
        Label : 'Submit'
    },
    {
        $Type : 'UI.DataFieldForAction',
        Action: 'LeaveService.approve',
        Label : 'Approve'
    },
    {
        $Type : 'UI.DataFieldForAction',
        Action: 'LeaveService.reject',
        Label : 'Reject'
    }
]);

annotate LeaveService.LeaveApprovals with @(
    Capabilities: {
        InsertRestrictions.Insertable: false,
        UpdateRestrictions.Updatable : false,
        DeleteRestrictions.Deletable : false
    },

    UI.LineItem : [
        {
            $Type: 'UI.DataField',
            Value: StepNo,
            Label: 'Step'
        },
        {
            $Type: 'UI.DataField',
            Value: Approver_ID,
            Label: 'Approver'
        },
        {
            $Type: 'UI.DataField',
            Value: Decision,
            Label: 'Decision'
        },
        {
            $Type: 'UI.DataField',
            Value: IsCurrent,
            Label: 'Current'
        },
        {
            $Type: 'UI.DataField',
            Value: DecisionDate,
            Label: 'Decision Date'
        },
        {
            $Type: 'UI.DataField',
            Value: Comments,
            Label: 'Comments'
        }
    ]
);

annotate LeaveService.LeaveRequests with {
    LeaveType @(
        Common.Text           : LeaveType.Description,
        Common.TextArrangement: #TextOnly,

        Common.ValueList      : {
            Label         : 'Leave Type',
            CollectionPath: 'LeaveTypes',
            Parameters    : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: LeaveType_ID,
                    ValueListProperty: 'ID'
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'Description'
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'MaxDays'
                }
            ]
        }
    );

    Employee  @(
        Common.Text           : Employee.EmployeeNumber,
        Common.TextArrangement: #TextOnly,

        Common.ValueList      : {
            Label         : 'Employee',
            CollectionPath: 'Employees',
            Parameters    : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: LeaveType_ID,
                    ValueListProperty: 'ID'
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'EmployeeNumber'
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'Email'
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'FirstName'
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'LastName'
                }
            ]
        }
    );
};
