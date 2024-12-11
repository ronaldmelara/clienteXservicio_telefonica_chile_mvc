 export interface Service {
    idservice: number,
    service: string,
    idarea: number,
    enable: number
}

export interface Contract {
    idservice: number;
    rut: number;
    dv: string;
    active: number;
}

export interface CachedRowValues {
    [key: string]: { [key: string]: boolean };
}


export interface Area {
    Services: Service[],
    area: string,
    idarea: number
}

export interface Custormer {
    rut: number,
    dv: string,
     customer: string,
     rutdv: string
}