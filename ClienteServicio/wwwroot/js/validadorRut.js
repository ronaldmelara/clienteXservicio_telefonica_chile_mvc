/* eslint-disable import/prefer-default-export */
/**
 * Validador de rut chileno, regresa true si es correcto
 * se puede enviar en cualquier formato de separacion de numeros validoos en chile
 * 11.111.111-1, 11111111-1, 111111111
 * o incluso con el digito verificador aparte
 * ej:
 * validateRUN('11.111.111', 1);
 * @param rut string | number
 * @param dv string | number
 * @return Boolean
 */
export function validateRUN(payload) {
    try {
        // Verificar si el d�gito verificador es v�lido
        if (!payload.dv || payload.dv.length === 0)
            throw new Error('D�gito verificador no proporcionado');
        // acumuladores e indices
        let sum = 0;
        let multiply = 2;
        // valida si se ingresa un digito verificador que solo sea como regex /[0-9]|k|K/
        if (String(payload.dv).length > 1)
            throw new Error('Invalid DV length');
        // sanitiza el rut ingresado y lo deja en un formato de n�meros
        // y d�gito verificador sin guion ni puntos
        const pre = String(payload.run)
            .replaceAll('.', '')
            .replaceAll('-', '');
        // sanitiza el d�gito verificador para compararlo
        let dv = payload.dv.toUpperCase(); // aseguramos que el DV sea en may�sculas
        const value = `${pre}${dv}`;
        // crea un array con el n�mero (sin el d�gito verificador)
        const body = value.slice(0, -1).split('').map(v => parseInt(v, 10));
        // valida el largo del RUT
        if (body.length < 7 || body.length > 8)
            throw new Error('Invalid Rut length');
        // recorre el RUT calculando el d�gito verificador
        body.reverse().forEach((val) => {
            sum += val * multiply;
            multiply++;
            if (multiply > 7) {
                multiply = 2;
            }
        });
        // c�lculo final del d�gito verificador
        const calCdv = 11 - (sum % 11);
        // asignaci�n del d�gito verificador seg�n el c�lculo
        let calculatedDv = calCdv === 11 ? '0' : (calCdv === 10 ? 'K' : calCdv.toString());
        // se compara y retorna si est� OK
        return dv === calculatedDv;
    }
    catch (error) {
        console.error(error);
        return false;
    }
}
