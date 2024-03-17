// import { faker } from "@faker-js/faker";
// import { BaseFactory } from "./BaseFactory";
// import { Agent } from "../../models/Agent";

// // -----------------------------------------------------------------------------

// export class AgentFactory extends BaseFactory<Agent> {
//     protected generateSpecifics(agent: Agent): Agent{
//         agent.photo = faker.image.urlPicsumPhotos();
//         const continents = ['Asia', 'Africa', 'America', 'Europe', 'Oceanía']
//         agent.specialty = continents[Math.floor(Math.random() * continents.length)];    
    

//       return agent;
//    }
// }