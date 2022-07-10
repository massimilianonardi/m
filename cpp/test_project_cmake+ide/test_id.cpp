// SPDX-FileCopyrightText: 2025 <copyright holder> <email>
// SPDX-License-Identifier: Apache-2.0

#include "test_id.h"

#include <tests/testcore.h>
#include <tests/autotestshell.h>

QTEST_MAIN(test_id);

using namespace KDevelop;

void test_id::initTestCase()
{
    AutoTestShell::init();
    TestCore::initialize(Core::Default);
}

void test_id::cleanupTestCase()
{
    TestCore::shutdown();
}

void test_id::init()
{
    // Called before each testfunction is executed
}

void test_id::cleanup()
{
    // Called after every testfunction
}

void test_id::testTest_case()
{

}
