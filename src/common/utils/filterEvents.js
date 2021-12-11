
export default async (ctc, eventName, ...args) => {
    const eventFilter = ctc.filters[eventName](...args);
    return await ctc.queryFilter(eventFilter);
}