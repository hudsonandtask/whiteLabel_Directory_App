#!/bin/bash

APP_DELEGATE=platforms/ios/*/*-Info.plist

echo $APP_DELEGATE

cat "@implementation NSURLRequest(DataController)" >> $APP_DELEGATE
cat "+ (BOOL)allowsAnyHTTPSCertificateForHost:(NSString *)host" >> $APP_DELEGATE
cat "{" >> $APP_DELEGATE
cat "    return YES;" >> $APP_DELEGATE
cat "}" >> $APP_DELEGATE
cat "@end" >> $APP_DELEGATE
