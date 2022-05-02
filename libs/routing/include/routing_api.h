#ifndef ROUTING_API_H_
#define ROUTING_API_H_

#include "graph_factory.h"
#include <string>
#include <vector>

namespace routing {

class RoutingAPI {
   public:
      RoutingAPI();
      virtual ~RoutingAPI();
      virtual IGraph *LoadFromFile(const std::string &file) const;
      virtual void AddFactory(const IGraphFactory *factory);

   private:
      std::vector<const IGraphFactory *> factories;
};

} // namespace routing

#endif
