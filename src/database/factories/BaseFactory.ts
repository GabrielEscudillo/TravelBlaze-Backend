import { ObjectLiteral, Repository } from "typeorm";

/**
 * La clase `BaseFactory` proporciona métodos básicos para generar instancias de entidades
 * utilizando un repositorio de TypeORM.
 *
 * @template T Tipo genérico que representa la entidad.
 */
export class BaseFactory<T extends ObjectLiteral> {
   /**
    * Repositorio TypeORM utilizado para la creación de instancias.
    * @protected
    */
   protected modelRepository: Repository<T>;

   /**
    * Constructor de la clase.
    *
    * @param {Repository<T>} modelRepository Repositorio TypeORM utilizado para la creación de instancias.
    */
   constructor(modelRepository: Repository<T>) {
      this.modelRepository = modelRepository;
   }

   /**
    * Método protegido que genera propiedades específicas para una instancia del modelo.
    * Debe ser sobrescrito por las clases hijas según las necesidades específicas.
    *
    * @param {T} model Instancia del modelo a la que se le generarán propiedades específicas.
    * @returns {T} Instancia del modelo con propiedades específicas generadas.
    * @protected
    */
   protected generateSpecifics(model: T): T {
      // Se sobreescribe en la clase hija según las necesidades específicas.
      return model;
   }

   /**
    * Método protegido que genera una instancia del modelo con propiedades específicas.
    * Utiliza el método generateSpecifics que puede ser sobrescrito por clases hijas.
    *
    * @returns {T} Instancia del modelo con propiedades específicas generadas.
    * @protected
    */
   protected generate(): T {
      let model = this.modelRepository.create();
      model = this.generateSpecifics(model);
      return model;
   }

   /**
    * Método público que crea un número especificado de instancias del modelo.
    *
    * @param {number} [count=1] Número de instancias a crear (por defecto es 1).
    * @returns {T[]} Un array de instancias del modelo creadas.
    */
   createMany(count: number = 1): T[] {
      const generated: T[] = [];

      for (let i = 0; i < count; i++) {
         const item = this.generate();
         generated.push(item);
      }

      return generated;
   }
}