import { AppDataSource } from "../data-source";
import { AgentFactory } from "../factories/AgentFactory";
import { Agent } from "../../models/Agent";
import { seedUsersWithRoles } from "./UserSeeder";
import { UserRoles } from "../../constants/UserRoles";


// -----------------------------------------------------------------------------

/**
 * Seeder para la generación de estudiantes y su almacenamiento en la base de datos.
 */
export const agentSeeder = async () => {
   try {
      // Inicializar la conexión con la base de datos
      await AppDataSource.initialize();

      // Definir la cantidad de estudiantes a crear
      const count = 5;

      // Llamar a la función para crear estudiantes con usuarios asociados
      await seedAgentsWithUser(count);

      // Imprimir mensaje de éxito
      console.log("Seeding artist successfully completed");
   } catch (error) {
      console.error("Error seeding the database:", error);
   } finally {
      // Cerrar la conexión con la base de datos, independientemente del resultado
      await AppDataSource.destroy();
   }
};

export const seedAgentsWithUser = async (count: number) => {
   // Obtener repositorios y fábricas necesarios
   const agentRepository = AppDataSource.getRepository(Agent);
   const agentFactory = new AgentFactory(agentRepository);

   // Generar usuarios asociados a roles de estudiantes
   const users = await seedUsersWithRoles({
      roles: [UserRoles.AGENT],
      count: count,
   });

   // Generar estudiantes
   const agent = agentFactory.createMany(count);

   // Asignar usuario a cada estudiante
   agent.forEach((agent, index) => {
      agent.user = users[index];
   });

   // Guardar estudiantes en la base de datos
   await agentRepository.save(agent);

   return agent;
};