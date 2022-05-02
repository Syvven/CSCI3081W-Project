#ifndef SIMULATION_MODEL_H_
#define SIMULATION_MODEL_H_

#include "CompositeFactory.h"
#include "IEntityFactory.h"
#include "controller.h"
#include "drone.h"
#include "entity.h"
#include "graph.h"
#include "robot.h"
using namespace routing;

//--------------------  Model ----------------------------

/// Simulation Model handling the transit simulation.  The model can communicate
/// with the controller.
class SimulationModel {
   public:
      SimulationModel(IController &controller);

      void SetGraph(const IGraph *graph) { this->graph = graph; }

      /// Creates a simulation entity
      void CreateEntity(JsonObject &entity);

      /// Deletes a simulation entity
      void DeleteEntity(JsonObject &data);

      /// Schedules a trip for an object in the scene
      void ScheduleTrip(JsonObject &details);

      /// Updates the simulation
      void Update(double dt);

      /// Adds a new entity type
      void AddFactory(IEntityFactory *factory);

      /// Pull the entites for new clients
      std::vector<IEntity *> GetEntities();

   protected:
      IController &controller;
      std::vector<IEntity *> entities;
      std::vector<Drone *> drones;
      std::vector<Robot *> robots;
      std::vector<IEntity *> scheduler;
      CompositeFactory *compFactory;
      const IGraph *graph;
};

#endif
