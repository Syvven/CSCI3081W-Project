#ifndef ROBOT_FACTORY_H_
#define ROBOT_FACTORY_H_

#include "IEntityFactory.h"
#include "entity.h"
#include "robot.h"

#include <vector>

class RobotFactory : public IEntityFactory {
   public:
      IEntity *CreateEntity(JsonObject &entity);
};

#endif
