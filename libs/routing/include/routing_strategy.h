#ifndef ROUTING_STRATEGY_H_
#define ROUTING_STRATEGY_H_

#include "graph.h"
#include <string>
#include <vector>

namespace routing {

class IGraph;

class RoutingStrategy {
   public:
      virtual ~RoutingStrategy() {}
      virtual std::vector<std::string> GetPath(const IGraph *graph,
                                               const std::string &from,
                                               const std::string &to) const = 0;
};

} // namespace routing

#endif
