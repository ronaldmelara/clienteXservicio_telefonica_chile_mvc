 interface Service {
    idservice: number,
    service: string,
    idarea: number,
    enable: number
}

 interface Contract {
    idservice: number;
    rut: number;
    active: number;
}

 interface CachedRowValues {
    [key: string]: { [key: string]: boolean };
}


 interface Area {
    Services: Service[],
    area: string,
    idarea: number
}

 interface Custormer {
    rut: number,
    dv: string,
     customer: string,
     rutdv: string
}