// SPDX-FileCopyrightText: 2025 <copyright holder> <email>
// SPDX-License-Identifier: Apache-2.0

#ifndef TEST_ID_H
#define TEST_ID_H

#include <QObject>

class test_id : public QObject
{
    Q_OBJECT

private Q_SLOTS:
    void initTestCase();
    void cleanupTestCase();

    void testTest_case();
};

#endif // TEST_ID_H
