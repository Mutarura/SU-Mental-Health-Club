'use client';

import Link from 'next/link';
import { PeopleIcon, CheckIcon, HeartIcon, BuildingIcon, DocumentIcon, SoundIcon, WarningIcon } from '../../components/icons';

export default function PeerSupportPage() {
  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Logo */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center mb-6">
            <div className="w-16 h-16 bg-white rounded-full p-2 shadow-md mr-4">
              <div className="w-full h-full bg-gradient-to-br from-su-blue to-su-red rounded-full flex items-center justify-center">
                <PeopleIcon className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-su-blue">Peer Support</h1>
          </div>
          <div className="w-24 h-1 bg-su-red mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Building stronger mental health through peer connections and mutual support.
          </p>
        </div>

        {/* Importance of Peer Support */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-su-blue bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
              <HeartIcon className="w-6 h-6 text-su-blue" />
            </div>
            <h2 className="text-3xl font-bold text-su-blue mb-6">Why Peer Support Matters</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-su-blue bg-opacity-10 rounded-full flex items-center justify-center mr-4 mt-1">
                  <CheckIcon className="w-4 h-4 text-su-blue" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Shared Understanding</h3>
                  <p className="text-gray-600">Fellow students understand the unique challenges of university life, academic pressure, and social dynamics.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-8 h-8 bg-su-blue bg-opacity-10 rounded-full flex items-center justify-center mr-4 mt-1">
                  <CheckIcon className="w-4 h-4 text-su-blue" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Reduced Stigma</h3>
                  <p className="text-gray-600">Talking to peers helps normalize mental health conversations and reduces feelings of isolation.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-8 h-8 bg-su-blue bg-opacity-10 rounded-full flex items-center justify-center mr-4 mt-1">
                  <CheckIcon className="w-4 h-4 text-su-blue" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Accessible Support</h3>
                  <p className="text-gray-600">Peer support is available, approachable, and often the first step toward seeking help.</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-su-red bg-opacity-10 rounded-full flex items-center justify-center mr-4 mt-1">
                  <CheckIcon className="w-4 h-4 text-su-red" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Mutual Growth</h3>
                  <p className="text-gray-600">Both supporters and those receiving support benefit from the connection and shared experiences.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-8 h-8 bg-su-red bg-opacity-10 rounded-full flex items-center justify-center mr-4 mt-1">
                  <CheckIcon className="w-4 h-4 text-su-red" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Community Building</h3>
                  <p className="text-gray-600">Peer support creates stronger, more connected campus communities where everyone feels valued.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-8 h-8 bg-su-red bg-opacity-10 rounded-full flex items-center justify-center mr-4 mt-1">
                  <CheckIcon className="w-4 h-4 text-su-red" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Early Intervention</h3>
                  <p className="text-gray-600">Peers can recognize warning signs early and encourage timely professional help when needed.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Guidelines Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-su-red bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
              <DocumentIcon className="w-6 h-6 text-su-red" />
            </div>
            <h2 className="text-3xl font-bold text-su-red mb-6">Guidelines for Effective Peer Support</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 border border-gray-200 rounded-lg">
              <div className="w-12 h-12 bg-su-blue bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <SoundIcon className="w-6 h-6 text-su-blue" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Active Listening</h3>
              <ul className="text-gray-600 text-left space-y-2">
                <li>• Give your full attention</li>
                <li>• Listen without judgment</li>
                <li>• Ask open-ended questions</li>
                <li>• Reflect back what you hear</li>
                <li>• Avoid interrupting or rushing</li>
              </ul>
            </div>
            
            <div className="text-center p-6 border border-gray-200 rounded-lg">
              <div className="w-12 h-12 bg-su-red bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <HeartIcon className="w-6 h-6 text-su-red" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Show Empathy</h3>
              <ul className="text-gray-600 text-left space-y-2">
                <li>• Validate their feelings</li>
                <li>• Share similar experiences carefully</li>
                <li>• Use "I" statements</li>
                <li>• Avoid minimizing their problems</li>
                <li>• Be genuine and authentic</li>
              </ul>
            </div>
            
            <div className="text-center p-6 border border-gray-200 rounded-lg">
              <div className="w-12 h-12 bg-su-gold bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <BuildingIcon className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Encourage Professional Help</h3>
              <ul className="text-gray-600 text-left space-y-2">
                <li>• Know your limits as a peer</li>
                <li>• Recognize when to refer</li>
                <li>• Provide resource information</li>
                <li>• Offer to accompany them</li>
                <li>• Follow up with care</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-su-blue to-su-red rounded-lg shadow-md p-8 text-white text-center mb-12">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <PeopleIcon className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Ready to Connect?</h2>
          <p className="text-xl mb-6 opacity-90">
            Join our peer support circles and be part of a caring community that supports each other&apos;s mental health journey.
          </p>
          <Link 
            href="/events"
            className="inline-block bg-white text-su-blue px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors"
          >
            Join our Peer Support Circles through upcoming events
          </Link>
        </div>

        {/* Emergency Contact */}
        <div className="bg-su-red rounded-lg shadow-md p-8 text-white text-center">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <WarningIcon className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Need Immediate Help?</h2>
          <p className="text-lg mb-6 opacity-90">
            If you&apos;re experiencing a mental health emergency, please contact:
          </p>
          <div className="space-y-2">
            <p className="text-xl font-bold">Strathmore Medical Centre: +254 703 034 000</p>
            <p className="text-xl font-bold">Kenya Red Cross: 1199</p>
            <p className="text-xl font-bold">Befrienders Kenya: +254 722 178 177</p>
          </div>
        </div>
      </div>
    </div>
  );
}