/**
 * Grid toolbar spec document
 */
import { EmitType, EventHandler } from '@syncfusion/ej2-base';
import { extend } from '@syncfusion/ej2-base/util';
import { createElement, remove } from '@syncfusion/ej2-base/dom';
import { Grid } from '../../../src/grid/base/grid';
import { Page } from '../../../src/grid/actions/page';
import { Selection } from '../../../src/grid/actions/selection';
import { Group } from '../../../src/grid/actions/group';
import { Toolbar } from '../../../src/grid/actions/toolbar';
import { data } from '../base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';

Grid.Inject(Page, Group, Selection, Toolbar);

function getEventObject(eventType: string, eventName: string): Object {
    let tempEvent: any = document.createEvent(eventType);
    tempEvent.initEvent(eventName, true, true);
    let returnObject: any = extend({}, tempEvent);
    returnObject.preventDefault = () => { return true; };
    return returnObject;
}

describe('Toolbar functionalities', () => {
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;
    let keyup: any = getEventObject('KeyboardEvent', 'keyup');
    keyup.keyCode = 13;

    beforeAll((done: Function) => {
        let dataBound: EmitType<Object> = () => { done(); };
        document.body.appendChild(elem);
        gridObj = new Grid(
            {
                dataSource: data,
                allowGrouping: true,
                columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                { field: 'ShipCity' }],
                toolbar: ['print', 'edit', { text: 'hello', id: 'hello' }, 'expand'],
                actionBegin: actionBegin,
                actionComplete: actionComplete,
                dataBound: dataBound
            });
        gridObj.appendTo('#Grid');
    });
    it('initial checck', () => {
        expect(gridObj.toolbarModule.getToolbar().firstElementChild.childElementCount).toEqual(4);
        expect(gridObj.element.firstElementChild.classList.contains('e-groupdroparea')).toEqual(true);
        let items: any = gridObj.toolbarModule.getToolbar().querySelectorAll('.e-overlay');
        expect(items[0].id).toEqual('Grid_edit');
    });
    it('check event trigger', (done: Function) => {
        gridObj.toolbarClick = (args: Object) => {
            expect(args['target']['id']).toEqual('hello');
            done();
        };
        (<any>gridObj.toolbarModule).toolbarClickHandler({ target: gridObj.toolbarModule.getToolbar().firstElementChild.children[2].firstChild });
    });
    it('enable Rtl', () => {
        gridObj.toolbarClick = undefined;
        gridObj.enableRtl = true;
        gridObj.dataBind();
        gridObj.toolbarModule.getToolbar()['ej2_instances'][0].dataBind();
        expect(gridObj.toolbarModule.getToolbar()['ej2_instances'][0]['enableRtl']).toEqual(true);
        expect(gridObj.toolbarModule.getToolbar().classList.contains('e-rtl')).toEqual(true);
    });
    it('disable Rtl', () => {
        gridObj.enableRtl = false;
        gridObj.dataBind();
        gridObj.toolbarModule.getToolbar()['ej2_instances'][0].dataBind();
        expect(gridObj.toolbarModule.getToolbar()['ej2_instances'][0]['enableRtl']).toEqual(false);
        expect(gridObj.toolbarModule.getToolbar().classList.contains('e-rtl')).toEqual(false);
    });
    it('change toolbar value', () => {
        gridObj.toolbar = ['search', 'add', 'update', 'cancel', 'hi'];
        gridObj.dataBind();
        expect(gridObj.toolbarModule.getToolbar().querySelector('.e-toolbar-left').children.length).toEqual(4);
        expect(gridObj.toolbarModule.getToolbar().querySelector('.e-toolbar-right').children.length).toEqual(1);
        expect(gridObj.toolbarModule.getToolbar().querySelectorAll('.e-overlay').length).toEqual(2);
    });
     it('check aria-attribute', () => {
        let search: Element = gridObj.toolbarModule.getToolbar().querySelector('.e-search');
        expect(search.querySelector('.e-searchfind').hasAttribute('tabindex')).toBeTruthy();
        expect(search.querySelector('.e-searchfind').hasAttribute('aria-label')).toBeTruthy();
    });
    it('Enable Toolbar items', () => {
        gridObj.toolbarModule.enableItems(['Grid_update'], true);
        gridObj.dataBind();
        expect(gridObj.toolbarModule.getToolbar().querySelectorAll('.e-overlay').length).toEqual(1);
    });
    it('add toolbar template', () => {
        let templete: string = '<div><div style="padding: 12px" title="search" ><input id="txt" type="search" style="padding: 0 5px"placeholder="search"></input><span id="searchbutton" class="e-search e-icons"></span></div></div>';
        document.body.appendChild(createElement('div', { innerHTML: templete, id: 'search' }));
        gridObj.toolbar = '#search';
        gridObj.dataBind();
        expect(gridObj.toolbarModule.getToolbar().firstElementChild.id).toEqual('search');
    });
    it('remove toolbar', () => {
        gridObj.toolbar = '';
        gridObj.dataBind();
        expect(gridObj.toolbarModule).toEqual(undefined);
    });
    it('render all predefined items', () => {
        gridObj.toolbar = ['add', 'edit', 'delete', 'update', 'cancel', 'print', 'excelexport', 'pdfexport', 'wordexport', 'search'];
        gridObj.dataBind();
        expect(gridObj.toolbarModule.getToolbar().querySelectorAll('.e-toolbar-item').length).toEqual(10);
    });

    it('check search', (done: Function) => {
        gridObj.actionComplete = () => {
            expect(gridObj.currentViewData.length).toEqual(0);
            expect(gridObj.searchSettings.key).toEqual('hai');
            done();
        };
        let searchElement: HTMLInputElement = <HTMLInputElement>gridObj.toolbarModule.getToolbar().querySelector('#' + gridObj.element.id + '_searchbar');
        (searchElement).value = 'hai';
        (<HTMLInputElement>gridObj.toolbarModule.getToolbar().querySelector('#' + gridObj.element.id + '_searchbar')).focus();
        expect(document.activeElement.id).toEqual(gridObj.element.id + '_searchbar');
        keyup.target = searchElement;
        EventHandler.trigger(searchElement, 'keyup', keyup);
    });
    it('check search with searchbutton', (done: Function) => {
        gridObj.actionComplete = () => {
            expect(gridObj.currentViewData.length).toEqual(15);
            expect(gridObj.searchSettings.key).toEqual('');
            done();
        };
        let searchElement: HTMLInputElement = <HTMLInputElement>gridObj.toolbarModule.getToolbar().querySelector('#' + gridObj.element.id + '_searchbar');
        searchElement.value = '';
        (<any>gridObj.toolbarModule).toolbarClickHandler({item: (<any>gridObj.toolbarModule).toolbar.items[9], originalEvent:{ target: document.getElementById(gridObj.element.id + '_searchbutton') }});
        (<any>gridObj.toolbarModule).toolbarClickHandler({item: (<any>gridObj.toolbarModule).toolbar.items[9], originalEvent:{ target: searchElement}});
    });

    it('Select a row', () => {
        gridObj.selectRow(1);
        expect(gridObj.toolbarModule.getToolbar().querySelectorAll('.e-overlay').length).toEqual(2);
        let items: any = gridObj.toolbarModule.getToolbar().querySelectorAll('.e-overlay');
        expect(items[1].id).toEqual('Grid_cancel');
        expect(items[0].id).toEqual('Grid_update');
    });

    it('De select selected row', () => {
        gridObj.selectRow(1);
        expect(gridObj.toolbarModule.getToolbar().querySelectorAll('.e-overlay').length).toEqual(4);
        let items: any = gridObj.toolbarModule.getToolbar().querySelectorAll('.e-overlay');
        expect(items[1].id).toEqual('Grid_delete');
        expect(items[0].id).toEqual('Grid_edit');
        expect(items[3].id).toEqual('Grid_cancel');
        expect(items[2].id).toEqual('Grid_update');
    });

    it('Select a cell', () => {
        gridObj.selectionSettings.mode = 'cell';
        gridObj.dataBind();
        gridObj.selectCell({ cellIndex: 0, rowIndex: 0 });
        expect(gridObj.toolbarModule.getToolbar().querySelectorAll('.e-overlay').length).toEqual(3);
        let items: any = gridObj.toolbarModule.getToolbar().querySelectorAll('.e-overlay');
        expect(items[0].id).toEqual('Grid_delete');
        expect(items[2].id).toEqual('Grid_cancel');
        expect(items[1].id).toEqual('Grid_update');
    });

    it('DeSelect selected cell', () => {
        gridObj.selectCell({ cellIndex: 0, rowIndex: 0 });
        expect(gridObj.toolbarModule.getToolbar().querySelectorAll('.e-overlay').length).toEqual(4);
        let items: any = gridObj.toolbarModule.getToolbar().querySelectorAll('.e-overlay');
        expect(items[0].id).toEqual('Grid_edit');
        expect(items[1].id).toEqual('Grid_delete');
        expect(items[3].id).toEqual('Grid_cancel');
        expect(items[2].id).toEqual('Grid_update');
    });

    it('check print', (done: Function) => {
        gridObj.printComplete = () => {
            done();
        };
        gridObj.beforePrint = (args: { element: Element }) => {
            expect((args.element.querySelector('.e-toolbar') as HTMLElement).style.display).toEqual('none');
        };
        (<HTMLElement>gridObj.toolbarModule.getToolbar().querySelector('#Grid_print')).click();
        //forcoverage
        (<any>gridObj.toolbarModule).toolbarClickHandler({target: (<any>gridObj.toolbarModule).element});
        (gridObj.toolbarModule as any).keyUpHandler({ keyCode: 12 });

        keyup.target = gridObj.toolbarModule.getToolbar();
        EventHandler.trigger(gridObj.toolbarModule.getToolbar() as HTMLElement, 'keyup', keyup);
        (<any>gridObj.toolbarModule).removeEventListener();
        (<any>gridObj.toolbarModule).selectAction({ name: 'cellDeselected' });
        (<any>gridObj.toolbarModule).unWireEvent();
        gridObj.isDestroyed = true;
        (<any>gridObj.toolbarModule).addEventListener();
        (<any>gridObj.toolbarModule).removeEventListener();
        gridObj.isDestroyed = false;
        (<any>gridObj.toolbarModule).onPropertyChanged({ module: 'Grouping' });
    });

    afterAll(() => {
        remove(elem);
    });
});