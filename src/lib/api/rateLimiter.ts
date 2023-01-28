
class RateLimiter { 

    queSize : number;
    ipMap : Map<string, number[]>;

    constructor(queSize : number) {
        this.queSize = queSize;
        this.ipMap = new Map<string, number[]>();
    }


    addIp(address : string) { 
        this.ipMap.set(address, []);
    }   
    

    markCurrentTime(address : string) {
        const currentTime = Date.now();
        const allTimes = this.ipMap.get(address);
        allTimes?.push(currentTime);

    }

    containIp(address : string) {
        return this.ipMap.has(address);
    } 


}

export default RateLimiter;