#ifndef ISTRATEGY_H_
#define ISTRATEGY_H_

#include "entity.h"
#include "graph.h"
#include <vector>

using namespace routing;

class IStrategy {
   public:
      virtual void Move(IEntity *entity, double dt) = 0;
      virtual bool IsCompleted() = 0;

   protected:
      // IGraph object to be used in the simulation.
      const IGraph *graph;
}; // close class

#endif // ISTRATEGY_H_
