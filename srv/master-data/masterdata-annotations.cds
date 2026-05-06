using MasterDataService from './masterdata-service';

annotate MasterDataService.Employees with {
    EmployeeNumber @Core.Computed;
};

annotate MasterDataService.Employees with @(
    Capabilities          : {
        InsertRestrictions.Insertable: true,
        UpdateRestrictions.Updatable : true,
        DeleteRestrictions.Deletable : true
    },

    UI.HeaderInfo         : {
        TypeName      : 'Employee',
        TypeNamePlural: 'Employees',
        Title         : {Value: EmployeeNumber},
        Description   : {Value: Email}
    },

    UI.SelectionFields    : [
        EmployeeNumber,
        FirstName,
        LastName,
        Email,
        CostCenter,
        Active
    ],

    UI.LineItem           : [
        {
            $Type: 'UI.DataField',
            Value: EmployeeNumber,
            Label: 'Employee No'
        },
        {
            $Type: 'UI.DataField',
            Value: FirstName,
            Label: 'First Name'
        },
        {
            $Type: 'UI.DataField',
            Value: LastName,
            Label: 'Last Name'
        },
        {
            $Type: 'UI.DataField',
            Value: Email,
            Label: 'Email'
        },
        {
            $Type: 'UI.DataField',
            Value: CostCenter,
            Label: 'Cost Center'
        },
        {
            $Type: 'UI.DataField',
            Value: Country_code,
            Label: 'Country'
        },
        {
            $Type: 'UI.DataField',
            Value: Active,
            Label: 'Active'
        }
    ],

    UI.FieldGroup #General: {Data: [
        {
            $Type: 'UI.DataField',
            Value: EmployeeNumber,
            Label: 'Employee No'
        },
        {
            $Type: 'UI.DataField',
            Value: FirstName,
            Label: 'First Name'
        },
        {
            $Type: 'UI.DataField',
            Value: LastName,
            Label: 'Last Name'
        },
        {
            $Type: 'UI.DataField',
            Value: Email,
            Label: 'Email'
        },
        {
            $Type: 'UI.DataField',
            Value: CostCenter,
            Label: 'Cost Center'
        },
        {
            $Type: 'UI.DataField',
            Value: Country_code,
            Label: 'Country'
        },
        {
            $Type: 'UI.DataField',
            Value: Active,
            Label: 'Active'
        }
    ]},

    UI.Facets             : [{
        $Type : 'UI.ReferenceFacet',
        Label : 'General Information',
        Target: '@UI.FieldGroup#General'
    }]
);

annotate MasterDataService.LeaveTypes with @(
    Capabilities          : {
        InsertRestrictions.Insertable: true,
        UpdateRestrictions.Updatable : true,
        DeleteRestrictions.Deletable : true
    },

    UI.HeaderInfo         : {
        TypeName      : 'Leave Type',
        TypeNamePlural: 'Leave Types',
        Title         : {Value: Code},
        Description   : {Value: Description}
    },

    UI.SelectionFields    : [
        Code,
        Description,
        Active
    ],

    UI.LineItem           : [
        {
            Value: Code,
            Label: 'Code'
        },
        {
            Value: Description,
            Label: 'Description'
        },
        {
            Value: MaxDays,
            Label: 'Max Days'
        },
        {
            Value: Active,
            Label: 'Active'
        }
    ],

    UI.FieldGroup #General: {Data: [
        {
            $Type: 'UI.DataField',
            Value: Code,
            Label: 'Code'
        },
        {
            $Type: 'UI.DataField',
            Value: Description,
            Label: 'Description'
        },
        {
            $Type: 'UI.DataField',
            Value: MaxDays,
            Label: 'Max Days'
        },
        {
            $Type: 'UI.DataField',
            Value: Active,
            Label: 'Active'
        }
    ]},

    UI.Facets             : [{
        $Type : 'UI.ReferenceFacet',
        Label : 'General Information',
        Target: '@UI.FieldGroup#General'
    }]
);
