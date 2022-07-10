#ifndef FUNCTIONS_H
#define	FUNCTIONS_H

void sleepms(long millis);
const char* generateKey();
void systemLaunch(const char* cmdline);
const char* replace(const char* source, const char* find, const char* replace);

#endif	/* FUNCTIONS_H */
