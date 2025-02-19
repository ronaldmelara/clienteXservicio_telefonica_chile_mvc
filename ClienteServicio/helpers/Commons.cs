namespace ClienteServicio.helpers
{
    public static class Commons
    {
        /// <summary>
        /// Mapea excepciones a códigos de estado HTTP.
        /// </summary>
        public static int GetStatusCodeFromException(Exception ex)
        {
            return ex switch
            {
                KeyNotFoundException => 404, // Recurso no encontrado
                UnauthorizedAccessException => 401, // No autorizado
                InvalidOperationException => 400, // Solicitud incorrecta
                _ => 500 // Error interno del servidor
            };
        }


        public static T ConvertDtoToEntity<T,K>(K dto) where T : new()
        {
            // Crear una instancia de la entidad genérica T
            var entity = new T();
            // Obtener las propiedades del tipo del DTO (K)
            foreach (var dtoProp in typeof(K).GetProperties())
            {
                // Buscar la propiedad correspondiente en la entidad (T)
                var entityProp = typeof(T).GetProperty(dtoProp.Name);

                if (entityProp != null && entityProp.CanWrite)
                {
                    // Transferir el valor de la propiedad del DTO a la entidad
                    entityProp.SetValue(entity, dtoProp.GetValue(dto));
                }
            }

            return entity;
        }

        public static List<T> ConvertDtoListToEntityList<T, K>(List<K> dtoList) where T : new()
        {
            // Crear una lista para almacenar las entidades convertidas
            var entityList = new List<T>();

            foreach (var dto in dtoList)
            {
                // Convertir cada elemento del DTO a la entidad
                var entity = new T();

                foreach (var dtoProp in typeof(K).GetProperties())
                {
                    var entityProp = typeof(T).GetProperty(dtoProp.Name);
                    if (entityProp != null && entityProp.CanWrite)
                    {
                        entityProp.SetValue(entity, dtoProp.GetValue(dto));
                    }
                }

                entityList.Add(entity);
            }

            return entityList;
        }
    }
}
