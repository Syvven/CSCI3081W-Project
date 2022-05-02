#ifndef DRONE_FACTORY_H_
#define DRONE_FACTORY_H_

#include "IEntityFactory.h"
#include "drone.h"
#include "entity.h"

#include <vector>

class DroneFactory : public IEntityFactory {
   public:
      virtual ~DroneFactory() {}
      IEntity *CreateEntity(JsonObject &entity);
};

#endif
