# Telemetry sent by this add-on

<!-- START doctoc generated TOC please keep comment here to allow auto update -->

<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

**Contents**

* [Usual Firefox Telemetry is mostly unaffected](#usual-firefox-telemetry-is-mostly-unaffected)
* [Study-specific endings](#study-specific-endings)
* [`shield-study` pings (common to all shield-studies)](#shield-study-pings-common-to-all-shield-studies)
* [`shield-study-addon` pings, specific to THIS study.](#shield-study-addon-pings-specific-to-this-study)
* [Example sequence for a 'voted => not sure' interaction](#example-sequence-for-a-voted--not-sure-interaction)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Usual Firefox Telemetry is mostly unaffected

* No change: `main` and other pings are UNAFFECTED by this add-on, except that [shield-studies-addon-utils](https://github.com/mozilla/shield-studies-addon-utils) adds the add-on id as an active experiment in the telemetry environment.
* Respects telemetry preferences. If user has disabled telemetry, no telemetry will be sent.

## Study-specific endings

The STUDY SPECIFIC ENDINGS this study supports are:

I don't think there are any ways this study can end besides being manually disabled or unenrolled? I think survey should be shown to all enrollees at unenrollment.


## `shield-study` pings (common to all shield-studies)

[shield-studies-addon-utils](https://github.com/mozilla/shield-studies-addon-utils) sends the usual packets.

## `shield-study-addon` pings, specific to THIS study.

Pings should be sent from the addon in the following cases:
* Study enrollment / initialization (`start` pingType)
* Study unenrollment / expiration (`stop` pingType)
* UI interaction with the addon (`engage` pingType)

Type of interaction events we need recorded (`interactionType` in ping schema):

1. `toolbarClick`: user clicked on the study's toolbar icon
2. `signinClick`: user clicked on the sync signin button from the doorhanger (only shown when user is not signed in)
3. `unverifiedOpenSyncClick`: user clicked on the button to open sync preferences (only shown when account is in unverified state)
4. `verifiedOpenAccountClick`: user clicked on the button to open FxA account prefs (only shown when account is in verified state)
5. `verifiedOpenSyncClick`: user clicked on the button to open sync prefs (only shown when account is in verified state)
6. `verifiedAvatarClick`: user clicked on their avatar to change it (only shown when account is in verified state)
7. `verifiedSendTabClick`: user clicked on the send tab link (TBD if this will be included; only shown in verified state; only shown to treatment2 branch)

## Example ping schema could look like this
This is just the schema for the specific things we need in this study (what goes in the payload section of the `shield-study-addon` ping), for an example of the full schema see [this](https://github.com/motin/taar-experiment-v3-shield-study/blob/develop/schemas/full-schema.json).

```
{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "title": "fxadisco",
  "definitions": {
    "attributes": {
      "properties": {
        "pingType": {
          "type": "string" // one of: start, stop, engage
        },
        "addonId": {
          "type": "string" // always fxadisco
        },
        "addonVersion" {
          "type": "string" // should be 1
        },
        "branch" {
          "type": "string" //  enrollment cohort; one of control, treatment1, treatment2
        },
        "startTime": {
          "type": "string" // timestamp of interaction event or enrollment
        },
        "fxaState": {
          "type": "string" // one of: verfied, unverfied, none
        },
        "interactionType": {
          "type": "string" // see list above for possible values, or `none`
        },
        "doorhangerActiveSeconds": {
          "type": "string" // number of seconds doorhanger was displayed for (0 if none)
        },
        "hasAvatar": {
          "type": "string" // true or false, does the user have their avatar displayed in the toolbar.
        }
      },
      "additionalProperties": false,
      "minProperties": 9
    }
  }
}

```
## Example sequence

TBD, example pings from schema above.
