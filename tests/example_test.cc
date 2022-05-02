#include "gtest/gtest.h"

class FactoryTest : public ::testing::Test {
   public:
      void SetUp() {}

   protected:
};

TEST_F(FactoryTest, CreateDrone) {
   EXPECT_TRUE(false) << "The test is not implemented";
}
