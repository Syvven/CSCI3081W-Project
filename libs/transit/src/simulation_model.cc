#include "simulation_model.h"
#include "AstarStrategy.h"
#include "Beeline.h"
#include "DroneFactory.h"
#include "RobotFactory.h"

SimulationModel::SimulationModel(IController &controller)
    : controller(controller) {
   compFactory = new CompositeFactory();
   compFactory->AddFactory(new DroneFactory());
   compFactory->AddFactory(new RobotFactory());
}

/// Creates an simulation entity
void SimulationModel::CreateEntity(JsonObject &entity) {
   if (entities.size() > 0) {
      entity["id"] = entities.back()->GetId() + 1;
   } else {
      entity["id"] = 0;
   }
   std::cout << "Creating " << entity["name"]
      << ", ID: " << entity["id"]
      << ", start: " << entity["position"] << std::endl;

   IEntity *myNewEntity = compFactory->CreateEntity(entity);
   myNewEntity->SetGraph(graph);

   // Call AddEntity to add it to the view
   controller.AddEntity(*myNewEntity);
   entities.push_back(myNewEntity);
}

/// Deletes an simulation entity
void SimulationModel::DeleteEntity(JsonObject &data) {
   JsonObject details = data["details"];
   int id = details["id"];
   for (int i = 0; i < entities.size(); i++) {
      if (entities.at(i)->GetId() == id) {
         JsonObject json = entities.at(i)->GetDetails();
         std::cout << "Deleting " << json["name"] << ", ID: "<< id << std::endl;
         entities.erase(entities.begin() + i);
         break;
      }
   }
   controller.RemoveEntity(id);
}

/// Schedules a trip for an object in the scene
void SimulationModel::ScheduleTrip(JsonObject &details) {
   int id = (int) details["name"];
   JsonArray end = details["end"];
   std::cout << id << ": " << details["start"] << " --> " << end << std::endl;

   for (auto entity : entities) { // Add the entity to the scheduler
      if (
         id == entity->GetId()
         && ((std::string) entity->GetDetails()["type"]).compare("robot") == 0
         && entity->GetAvailability()
      ) {
         entity->SetStrategyName(details["search"]);
         entity->SetDestination(Vector3(end[0], end[1], end[2]));
         scheduler.push_back(entity);
         break;
      }
   }
   controller.SendEventToView("TripScheduled", details);

   // Add a route to visualize the path
   // controller.AddPath(pathId, path);
}

/// Updates the simulation
void SimulationModel::Update(double dt) {
   // std::cout << "Update: " << dt << std::endl;

   // Call controller to update changed entities
   for (int i = 0; i < entities.size(); i++) {
      entities[i]->Update(dt, scheduler);
      controller.UpdateEntity(*entities[i]);
   }

   // Remove entites you no longer need
   // controller.RemoveEntity(myDeletedEntityId);

   // Remove paths you no longer want to see:
   // controller.RemovePath(myDeletedPathId);
}

void SimulationModel::AddFactory(IEntityFactory *factory) {
   compFactory->AddFactory(factory);
}

std::vector<IEntity *> SimulationModel::GetEntities() { return entities; }
