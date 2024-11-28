
var dropdown = new ej.dropdowns.DropDownList({
    dataSource: ["Pagination", "Virtual Scroll"],
    change: ddChange,
    value: "Pagination",
    width: 250,
})
dropdown.appendTo('#ddlelement');

var grid = new ej.grids.Grid({
    dataSource: window.orderData,
    height: 270,
    allowPaging: true,
    allowSorting: true,
    allowResizing: true,
    allowFiltering: true,
    allowPdfExport: true,
    allowReordering: true,
    allowExcelExport: true,
    showColumnChooser: true,
    width: 1200,
    filterSettings: { type: 'Menu' },
    pageSettings: { pageCount: 7, pageSizes: true },
    editSettings: { allowAdding: true, allowEditing: true, allowDeleting: true, mode: 'Normal' },
    toolbar: ['Add', 'Delete', 'Update', 'Cancel', 'Search', 'ExcelExport', 'PdfExport', 'CsvExport', 'Print', 'ColumnChooser'],
    contextMenuItems: ['AutoFit', 'AutoFitAll', 'SortAscending', 'SortDescending',
        'Copy', 'Edit', 'Delete', 'Save', 'Cancel', 'PdfExport', 'ExcelExport',
        'CsvExport', 'FirstPage', 'PrevPage', 'LastPage', 'NextPage'],
    columns: [
        { field: 'OrderID', headerText: 'Order ID', isPrimaryKey: true, textAlign: 'Right', width: 220, validationRules: { required: true }, freeze: 'Left'},
        { field: 'CustomerID', headerText: 'Customer ID', width: 180, editType: 'dropdownedit' },
        { field: 'Freight', headerText: 'Frieght', width: 200, format: 'C2', editType: 'numericedit', textAlign: 'Right' },
        { field: 'OrderDate', headerText: 'Order Date', width: 220, format: 'yMd', editType: 'datepickeredit', textAlign: 'Right', freeze: 'Fixed'  },
        { field: 'ShipName', headerText: 'Ship Name', width: 220, clipMode: 'EllipsisWithTooltip' },
        { field: 'ShipCity', headerText: 'Ship City', width: 220, validationRules: { required: true, minLength: 3, maxLength: 20 } },
        { field: 'ShipCountry', headerText: 'Ship Country', width: 180 },
        { field: 'ShipRegion', headerText: 'Ship Region', width: 180, type: 'string',freeze: 'Right'},
    ],
    aggregates: [{
        columns: [{
            type: 'Sum',
            field: 'Freight',
            format: 'C2',
            footerTemplate: 'Sum: ${Sum}'
        }]
    },
    {
        columns: [{
            type: 'Average',
            field: 'Freight',
            format: 'C2',
            footerTemplate: 'Average: ${Average}'
        }]
    }],
});
grid.appendTo('#Grid');

    var columnMenu = new ej.buttons.CheckBox();
    columnMenu.appendTo('#columnMenu');
    document.getElementById('columnMenu').onclick = function () {
        if (columnMenu.checked) {
            grid.showColumnMenu = true;
        }
        else {
            grid.showColumnMenu = false;
        }
    };

    var rtl = new ej.buttons.CheckBox();
    rtl.appendTo('#rtl');
    document.getElementById('rtl').onclick = function () {
        if (rtl.checked) {
            grid.enableRtl = true;
        }
        else {
            grid.enableRtl = false;
        }
    };


    var theme = new ej.buttons.CheckBox();
    theme.appendTo('#styleToggle');
    var themeLink = document.getElementById('themeStylesheet');

    document.getElementById('styleToggle').onclick = function () {
        if (theme.checked) {
            themeLink.href = 'tailwind3-dark.css'; // Use the correct file extension
        } else {
            themeLink.href = 'tailwind3.css';
        }
    };

    var checkBoxObj = new ej.buttons.CheckBox({ change: onBiggerChange });
        checkBoxObj.appendTo('#bigger');

    function onBiggerChange(e) {
        e.checked ? document.body.classList.add('e-bigger') : document.body.classList.remove('e-bigger');
        grid.freezeRefresh();
    }

    function ddChange(args) {
        grid.columns.map(x=> x.visible = true);
        if (args.value === "Pagination") {
            grid.setProperties({
                groupSettings: { columns: [] },
                filterSettings: { columns: [] },
                sortSettings: { columns: [] },
                allowPaging: true,
                enableVirtualization: false,
                enableInfiniteScrolling: false,
            }, true)
            // grid.clearGrouping();
        }
        if (args.value === "Virtual Scroll") {
            grid.setProperties({
                groupSettings: { columns: [] },
                filterSettings: { columns: [] },
                sortSettings: { columns: [] },
                allowPaging: false,
                enableVirtualization: true,
                enableInfiniteScrolling: false,
            }, true)
            // grid.clearGrouping();
            grid.gridPager = null;
        }
        grid.freezeRefresh();
    }

    var filtertype = [
        { id: 'Menu', type: 'Menu' },
        { id: 'CheckBox', type: 'Checkbox' },
        { id: 'Excel', type: 'Excel' }
    ];

    var dropDownFilterType = new ej.dropdowns.DropDownList({
        dataSource: filtertype,
        fields: { text: 'type', value: 'id' },
        value: 'Menu',
        change: function (e) {
            var dropSelectedValue = e.value;
            grid.filterSettings.type = dropSelectedValue;
            grid.clearFiltering();
            var propertyTbody = document.querySelector('#property tbody');
            var enableInfiniteLoad;
            if (dropSelectedValue === 'Excel' || dropSelectedValue === 'CheckBox') {
                if (propertyTbody.children.length < 2) {
                    var temp = document.getElementsByTagName("template")[0];
                    var cloneTemplate = temp.content.cloneNode(true);
                    propertyTbody.appendChild(cloneTemplate.querySelector("tr.infinite-row"));
                    enableInfiniteLoad = new ej.buttons.CheckBox({
                        change: function(e) {
                            grid.filterSettings.enableInfiniteScrolling = e.checked;
                        }
                    });
                    enableInfiniteLoad.appendTo('#dataloadtype');
                } else {
                    enableInfiniteLoad = document.getElementById('dataloadtype').ej2_instances[0];
                    enableInfiniteLoad.checked = false;
                    grid.filterSettings.enableInfiniteScrolling = false;
                }
            } else {
                grid.filterSettings.enableInfiniteScrolling = false;
                ej.base.remove(document.querySelector('#property tbody tr.infinite-row'));
            }
        }
    });
    dropDownFilterType.appendTo('#filtertype');

  
