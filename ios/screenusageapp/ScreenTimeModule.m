#import "ScreenTimeModule.h"
#import <React/RCTLog.h>

@implementation ScreenTimeModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(getUsage:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
{
    RCTLogInfo(@"getUsage called");

    // Here, you need to use Objective-C code equivalent to your Swift code
    // Unfortunately, DeviceActivityReport is not available in Objective-C,
    // so you'll need to bridge your Swift code.

    NSError *error = [NSError errorWithDomain:@"E_LOAD_FAILED" code:200 userInfo:nil];
    reject(@"E_LOAD_FAILED", @"Failed to load Device Activity Report", error);
}

@end

