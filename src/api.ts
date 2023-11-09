import { sp } from "@pnp/sp/presets/all";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

export function GetListByTitle(listName: string, filter_req: string = '', select_req: string = '*', expand_req: string = '', orderBy_req: string = 'Id'): Promise<any> {
    return new Promise(async resolve => {
        return sp.web.lists.getByTitle(listName).items.filter(filter_req).expand(expand_req).select(select_req).orderBy(orderBy_req).getAll().then(async items => {
            items = fixResult(items);
            items = await FixTimeZoneDisplay(items) as any;
            resolve(items);
        }, reason => {
            console.error(reason);
            resolve([]);
        });
    });
}

export async function GetUserGroups(SPcontext, cb?) {
    let groups_list = await sp.web.currentUser.groups();
    const groups = groups_list.map(group => group.Title);
    return groups;

    return await SPcontext.msGraphClientFactory
        .getClient()
        .then((client): void => {
            client
                .api("/me/memberOf?$top=999")
                .get()
                .then((graphgroups: any) => {
                    const securiry_groups = graphgroups.value.map(group => group.displayName);
                    if (cb)
                        cb(securiry_groups);
                    return securiry_groups;
                }, (error: any) => {
                    console.log(error.message);
                });
        });
}

function fixResult(data: any): any {
    if (data && data.d && data.d.results)
        return data.d.results;
    if (data && data.d)
        return data.d;
    if (data && data.results)
        return data.results;
    return data;
}

let _timeZone: any = null;
async function GetTimeZone(): Promise<any> {
    return new Promise(resolve => {
        if (!!_timeZone)
            resolve(_timeZone);
        else
            return sp.web.regionalSettings.timeZone().then(result => {
                result = fixResult(result);
                _timeZone = result;
                resolve(result);
            });
    });
}

async function FixTimeZoneDisplay(arr): Promise<Object> {
    return new Promise(async resolve => {
        await GetTimeZone().then(timeZone => {
            arr.forEach(item => {
                for (let key in item) {
                    const isoDateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z?/.test(item[key]);

                    if (!!item[key] && isoDateFormat) {
                        const date_item = new Date(item[key]);
                        let offset = date_item.getTimezoneOffset();
                        offset = isDST(date_item) ? offset : offset - 60;
                        let TimezoneOffset = offset * 60 * 1000;
                        let Bias = (timeZone.Information.Bias + timeZone.Information.DaylightBias) * 60 * 1000;
                        let time = date_item.getTime();
                        date_item.setTime(time - Bias + TimezoneOffset);
                        item[key] = date_item;
                    }
                }
            })

            return resolve(arr);
        });
    });
}

function isDST(d: any) {
    let jan = new Date(d.getFullYear(), 0, 1).getTimezoneOffset();
    let jul = new Date(d.getFullYear(), 6, 1).getTimezoneOffset();
    return Math.max(jan, jul) !== d.getTimezoneOffset();
}