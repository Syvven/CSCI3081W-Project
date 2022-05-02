#ifndef SPIN_DECORATOR_H_
#define SPIN_DECORATOR_H_

#include "CelebrationDecorator.h"
#include "IStrategy.h"
#include <vector>

class SpinDecorator : public CelebrationDecorator {
   public:
      SpinDecorator(IStrategy *strategy_) : CelebrationDecorator(strategy_) {}
      bool IsCompleted();
      void Move(IEntity *entity, double dt);
}; // close class

#endif // SPIN_DECORATOR_H_
