import * as _ from "ramda"
import * as Promise from "bluebird"

import { DynamoDb, SES } from "../../lib/common/aws"
import { Context } from "../../lib/common/typings/aws-lambda"
import { CollectAuth0Emails } from "./action"
import { Subscriptions } from "../../lib/subscriptions"
import { handle } from "../../lib/handler"
import { Streams } from "../../lib/common/streams"
import { Coinbase } from "../../lib/coinbase"
import { Crypto } from "../../lib/common/crypto"


const documentClient = DynamoDb.documentClientAsync(process.env.AWS_DYNAMO_REGION)

const inject: CollectAuth0Emails.Inject = {
  load:
  _.curry(DynamoDb.load)(documentClient, process.env.AWS_STORAGE_TABLE, "tb-backend-ContinueSubscriptionEmail"),
  save:
  _.curry(DynamoDb.save)(documentClient, process.env.AWS_STORAGE_TABLE, "tb-backend-ContinueSubscriptionEmail"),
  getNewAuth0Emails: (numberOfAlreadyCollectedEmails: number) => Promise < Array < string >>,
  addEmailsToMailchomp: (emails: Array<string>) => Promise<any>
}

export function handler(event: any, context: Context) {
  handle(CollectAuth0Emails.action, inject, event, context)
}