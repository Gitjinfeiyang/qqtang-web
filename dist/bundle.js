/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = window["webpackHotUpdate"];
/******/ 	window["webpackHotUpdate"] = // eslint-disable-next-line no-unused-vars
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) {
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if (parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadUpdateChunk(chunkId) {
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		;
/******/ 		head.appendChild(script);
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadManifest(requestTimeout) {
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if (typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch (err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if (request.readyState !== 4) return;
/******/ 				if (request.status === 0) {
/******/ 					// timeout
/******/ 					reject(
/******/ 						new Error("Manifest request to " + requestPath + " timed out.")
/******/ 					);
/******/ 				} else if (request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if (request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch (e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "3a8b4884bd5408679292"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateRequire(moduleId) {
/******/ 		var me = installedModules[moduleId];
/******/ 		if (!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if (me.hot.active) {
/******/ 				if (installedModules[request]) {
/******/ 					if (installedModules[request].parents.indexOf(moduleId) === -1)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if (me.children.indexOf(request) === -1) me.children.push(request);
/******/ 			} else {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" +
/******/ 						request +
/******/ 						") from disposed module " +
/******/ 						moduleId
/******/ 				);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for (var name in __webpack_require__) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(__webpack_require__, name) &&
/******/ 				name !== "e"
/******/ 			) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if (hotStatus === "ready") hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if (hotStatus === "prepare") {
/******/ 					if (!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateModule(moduleId) {
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if (typeof dep === "undefined") hot._selfAccepted = true;
/******/ 				else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if (typeof dep === "undefined") hot._selfDeclined = true;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if (!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if (idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for (var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = +id + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply) {
/******/ 		if (hotStatus !== "idle")
/******/ 			throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if (!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{
/******/ 				// eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if (
/******/ 				hotStatus === "prepare" &&
/******/ 				hotChunksLoading === 0 &&
/******/ 				hotWaitingFiles === 0
/******/ 			) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) {
/******/ 		if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for (var moduleId in moreModules) {
/******/ 			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if (!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if (!deferred) return;
/******/ 		if (hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve()
/******/ 				.then(function() {
/******/ 					return hotApply(hotApplyOnUpdate);
/******/ 				})
/******/ 				.then(
/******/ 					function(result) {
/******/ 						deferred.resolve(result);
/******/ 					},
/******/ 					function(err) {
/******/ 						deferred.reject(err);
/******/ 					}
/******/ 				);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for (var id in hotUpdate) {
/******/ 				if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options) {
/******/ 		if (hotStatus !== "ready")
/******/ 			throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while (queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if (!module || module.hot._selfAccepted) continue;
/******/ 				if (module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if (module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for (var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if (!parent) continue;
/******/ 					if (parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 					if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if (!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/
/******/ 		function addAllToSet(a, b) {
/******/ 			for (var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if (a.indexOf(item) === -1) a.push(item);
/******/ 			}
/******/ 		}
/******/
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn(
/******/ 				"[HMR] unexpected require(" + result.moduleId + ") to disposed module"
/******/ 			);
/******/ 		};
/******/
/******/ 		for (var id in hotUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				/** @type {TODO} */
/******/ 				var result;
/******/ 				if (hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				/** @type {Error|false} */
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if (result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch (result.type) {
/******/ 					case "self-declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of self decline: " +
/******/ 									result.moduleId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of declined dependency: " +
/******/ 									result.moduleId +
/******/ 									" in " +
/******/ 									result.parentId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 						if (!options.ignoreUnaccepted)
/******/ 							abortError = new Error(
/******/ 								"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if (options.onAccepted) options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if (options.onDisposed) options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if (abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if (doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for (moduleId in result.outdatedDependencies) {
/******/ 						if (
/******/ 							Object.prototype.hasOwnProperty.call(
/******/ 								result.outdatedDependencies,
/******/ 								moduleId
/******/ 							)
/******/ 						) {
/******/ 							if (!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(
/******/ 								outdatedDependencies[moduleId],
/******/ 								result.outdatedDependencies[moduleId]
/******/ 							);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if (doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for (i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if (
/******/ 				installedModules[moduleId] &&
/******/ 				installedModules[moduleId].hot._selfAccepted
/******/ 			)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if (hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while (queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if (!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for (j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/
/******/ 			// remove "parents" references from all children
/******/ 			for (j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if (!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if (idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if (idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/
/******/ 		// insert new code
/******/ 		for (moduleId in appliedUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for (i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if (cb) {
/******/ 							if (callbacks.indexOf(cb) !== -1) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for (i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch (err) {
/******/ 							if (options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if (!options.ignoreErrored) {
/******/ 								if (!error) error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch (err) {
/******/ 				if (typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch (err2) {
/******/ 						if (options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if (!options.ignoreErrored) {
/******/ 							if (!error) error = err2;
/******/ 						}
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if (options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if (!options.ignoreErrored) {
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if (error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(6)(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(4)(false);
// imports


// module
exports.push([module.i, "*{margin:0; padding:0;}\r\n            #svgArea{height:100vh; width:100vw;}\r\n            .j-wfd-rect rect{fill:#ec5555;stroke:#ccc;stroke-width:4;}\r\n            .j-wfd-rect rect:hover{stroke:#aaa;}\r\n\r\n            .j-wfd-ellipse ellipse{fill:#ffb268;stroke:#ccc;stroke-width:4;}\r\n            .j-wfd-ellipse ellipse:hover{stroke:#aaa;}\r\n\r\n            .j-wfd-line path{fill:none;stroke:#999;stroke-width:2;}\r\n            .j-wfd-line:hover path{stroke:#333; stroke-width:4;}\r\n            .j-wfd-line-text{fill:#333; font-size: 10px; }\r\n            text {\r\n                  fill:#333;\r\n                  font-size: 10px;\r\n                  text-anchor: middle;  /* 文本水平居中 */\r\n                  dominant-baseline: middle; /* 文本垂直居中 */\r\n            }\r\n\r\n            svg {\r\n\r\n-webkit-touch-callout: none; /* iOS Safari */\r\n\r\n-webkit-user-select: none; /* Chrome/Safari/Opera */\r\n\r\n-khtml-user-select: none; /* Konqueror */\r\n\r\n-moz-user-select: none; /* Firefox */\r\n\r\n-ms-user-select: none; /* Internet Explorer/Edge */\r\n\r\nuser-select: none; /* Non-prefixed version, currently\r\n\r\nnot supported by any browser */\r\n\r\n}", ""]);

// exports


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var PIXI = window.PIXI;
// const Sound=(<any>window).sounds;
var Howl = window.Howl;
exports.default = {
    start: start
};
var pid = 0,
    pname = '';
var res = {
    male_red_1: "./static/res/走图/Done_body11001_walk.png",
    female_red_1: "./static/res/走图/Done_body13001_walk.png",
    male_blue: "./static/res/走图/Done_body55001_walk.png",
    male_black: "./static/res/走图/Done_body65001_walk.png",
    maptile: "./static/res/地图/maptile.png",
    maptile2: "./static/res/地图/maptile2.png",
    maptile3: "./static/res/地图/paotile1.png",
    maptile4: "./static/res/地图/paotile.png",
    maptile5: "./static/res/地图/Q版树林精灵类动画游戏素材-丛林qq堂-Map 元素_6(M_爱给网_aigei_com.png",
    bubble_normal: "./static/res/泡泡/bubble_normal.png",
    // bubble_orange:"./static/res/泡泡/香橙.png",
    bubble_yellow_boom: "./static/res/泡泡/bubbleboom.png",
    medicine: "./static/res/物品/强力药.png",
    start_page: "./static/res/窗口/开始画面.png",
    start_button: "./static/res/窗口/start.png",
    restart_button: "./static/res/窗口/restart.png",
    playerfall1: "./static/res/泡泡/100组卡通烟火冲击序列-魔法光效-0_爱给网_aigei_com.png",
    playerfall2: "./static/res/泡泡/100组卡通烟火冲击序列-魔法光效-1_爱给网_aigei_com.png",
    playerfall3: "./static/res/泡泡/100组卡通烟火冲击序列-魔法光效-2_爱给网_aigei_com.png",
    playerfall4: "./static/res/泡泡/100组卡通烟火冲击序列-魔法光效-3_爱给网_aigei_com.png",
    playerfall5: "./static/res/泡泡/100组卡通烟火冲击序列-魔法光效-5_爱给网_aigei_com.png"
};
var sounds = {
    path: "./static/res/music/",
    manifest: [{ id: "home", src: { ogg: "das.ogg" } }, { id: "water", src: { ogg: "water.ogg" } }, { id: "readygo", src: { ogg: "ReadyGo.wav" } }, { id: "uinormal", src: { ogg: "uiNormal.wav" } }, { id: "eat", src: { ogg: "X08_01.wav" } }, { id: "bubbleboom", src: { ogg: "X10_01.wav" } }, { id: "playerboom", src: { ogg: "X12_01.wav" } }, { id: "femalethanks", src: { ogg: "X39_01.wav" } }, { id: "malethanks", src: { ogg: "x40_01.wav" } }]
};
//m type
var a = 1,
    b = 2,
    c = 3,
    d = 4,
    e = 5,
    f = 6,
    z = -1,
    x = -2;
var map = [
// 1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18
z, b, a, b, 0, a, 0, 0, e, e, 0, 0, a, 0, b, a, b, z, z, d, c, 0, 0, 0, 0, c, d, d, c, 0, 0, 0, 0, c, d, z, z, b, b, 0, d, 0, a, a, a, a, a, a, a, 0, d, b, b, z, z, d, 0, z, z, 0, a, 0, 0, 0, 0, 0, a, 0, z, 0, d, z, x, e, 0, e, d, 0, a, 0, x, x, x, 0, a, 0, e, 0, e, x, x, e, 0, e, d, 0, a, 0, 0, 0, 0, 0, a, 0, e, 0, e, x, z, d, 0, z, z, 0, a, a, a, a, a, a, a, 0, z, 0, d, z, z, b, b, 0, 0, x, b, b, b, x, b, b, b, x, 0, b, b, z, z, d, c, 0, 0, 0, 0, x, d, x, d, x, 0, 0, 0, c, d, z, z, b, a, b, c, c, c, d, c, x, c, d, c, c, b, a, b, z];
var Direction;
(function (Direction) {
    Direction["UP"] = "up";
    Direction["DOWN"] = "down";
    Direction["LEFT"] = "left";
    Direction["RIGHT"] = "right";
})(Direction || (Direction = {}));
var PlayerState;
(function (PlayerState) {
    PlayerState[PlayerState["TRANSPARENT"] = 1] = "TRANSPARENT";
    PlayerState[PlayerState["NORMAL"] = 2] = "NORMAL";
    PlayerState[PlayerState["FALL"] = 3] = "FALL";
    PlayerState[PlayerState["DIE"] = 4] = "DIE"; //死亡状态
})(PlayerState || (PlayerState = {}));
var defaultProps = calcWindowSize();
function calcWindowSize() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    var col = 18;
    var row = 10;
    var xsize = width / col;
    var ysize = height / row;
    var size = xsize;
    //宽高比 大
    if (xsize > ysize) {
        size = ysize;
    }
    return {
        col: col, row: row,
        height: row * size,
        width: col * size,
        size: size
    };
}
var mapTile = {
    xStart: 0,
    yStart: 0,
    step: 56
};
//sound.js 兼容性有问题
var soundInstance = {};

var GameSound = function () {
    function GameSound() {
        _classCallCheck(this, GameSound);
    }

    _createClass(GameSound, null, [{
        key: "load",
        value: function load(callback) {
            // Sound.whenLoaded = callback;
            var soundList = sounds.manifest.map(function (item) {
                return sounds.path + item.src.ogg;
            });
            soundList.forEach(function (item) {
                soundInstance[item] = new Howl({
                    src: [item]
                });
            });
            callback();
            // soundInstance = new Howl({
            //     src: soundList
            //   });
            //   soundInstance.once('load', function(){
            //     callback()
            //   });
        }
    }, {
        key: "play",
        value: function play(id) {
            var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            var src = sounds.manifest.find(function (item) {
                return item.id == id;
            });
            if (src) {
                // let music=Sound[sounds.path+src.src.ogg]
                // Object.keys(config).forEach((key) => {
                //     music[key]=config[key]
                // })
                soundInstance[sounds.path + src.src.ogg].play();
                if (config.loop) {
                    soundInstance[sounds.path + src.src.ogg].loop(true);
                }
            }
        }
    }, {
        key: "pause",
        value: function pause(id) {
            // let src=sounds.manifest.find((item) => {
            //     return item.id==id;
            // })
            // if(src){
            //     let music=Sound[sounds.path+src.src.ogg]
            //     music.pause(id);
            // }
        }
    }]);

    return GameSound;
}();

var GameControler = function () {
    function GameControler(props) {
        _classCallCheck(this, GameControler);

        this.platform = props.platform;
        this.onDirectionChange = null;
        this.onAction = null;
        this.directionEle = null;
        this.actionEle = null;
        if (this.platform == 'pc') {
            this.initPC();
        } else {
            this.initMobile();
        }
    }

    _createClass(GameControler, [{
        key: "initMobile",
        value: function initMobile() {
            var _this = this;

            var r = 80,
                r1 = 50;
            this.directionEle = new PIXI.Container();
            this.directionEle.width = r * 2;
            this.directionEle.height = r * 2;
            var outside = new PIXI.Graphics();
            this.directionEle.addChild(outside);
            outside.beginFill(0xffffff, 0.3);
            outside.drawCircle(0, 0, r);
            outside.endFill();
            outside.x = r;
            outside.y = r;
            outside.interactive = true;
            var allowControl = false;
            var last = '';
            outside.on("pointermove", function (e) {
                if (!allowControl) return;
                var x = e.data.global.x;
                var y = e.data.global.y;
                if (x - _this.directionEle.x <= 0) {
                    if (last === 'ArrowLeft') return;
                    _this.emitDirectionChange({ direction: "ArrowLeft" });
                } else if (x - _this.directionEle.x - r * 2 >= 0) {
                    if (last === 'ArrowLeft') return;
                    _this.emitDirectionChange({ direction: "ArrowRight" });
                } else if (y - _this.directionEle.y <= 0) {
                    if (last === 'ArrowUp') return;
                    _this.emitDirectionChange({ direction: "ArrowUp" });
                } else if (y - _this.directionEle.y - r * 2 >= 0) {
                    if (last === 'ArrowDown') return;
                    _this.emitDirectionChange({ direction: "ArrowDown" });
                } else {
                    if (last === 'Center') return;
                    _this.emitDirectionChange({ direction: "Center" });
                }
            });
            outside.on("pointerdown", function (e) {
                allowControl = true;
            });
            outside.on("touchend", function (e) {
                allowControl = false;
                _this.emitDirectionChange({ direction: "Center" });
            });
            outside.on("touchendoutside", function (e) {
                allowControl = false;
                _this.emitDirectionChange({ direction: "Center" });
            });
            this.actionEle = new PIXI.Container();
            var createBubble = new PIXI.Graphics();
            this.actionEle.addChild(createBubble);
            createBubble.beginFill(0xffffff, 0.3);
            createBubble.drawCircle(0, 0, r1);
            createBubble.endFill();
            createBubble.x = r1;
            createBubble.y = r1;
            createBubble.interactive = true;
            createBubble.on("tap", function (e) {
                _this.emitAction({ action: "CreateBubble" });
            });
        }
    }, {
        key: "attachDirectionControler",
        value: function attachDirectionControler(pixi, x, y) {
            pixi.addChild(this.directionEle);
            if (x) {
                this.directionEle.x = x;
            }
            if (y) {
                this.directionEle.y = y;
            }
        }
    }, {
        key: "attachActionControler",
        value: function attachActionControler(pixi, x, y) {
            pixi.addChild(this.actionEle);
            if (x) {
                this.actionEle.x = x;
            }
            if (y) {
                this.actionEle.y = y;
            }
        }
    }, {
        key: "initPC",
        value: function initPC() {
            var _this2 = this;

            var keydownArr = [];
            window.addEventListener("keydown", function (e) {
                if (e.repeat) return;
                var keycode = e.code;
                if (keycode == 'Space') {
                    _this2.emitAction({ action: "CreateBubble" });
                    return;
                }
                if (keydownArr.indexOf(keycode) >= 0) return;
                keydownArr.push(keycode);
                _this2.emitDirectionChange({ direction: keycode });
            });
            window.addEventListener("keyup", function (e) {
                var keycode = e.code;
                var keycodeIndex = keydownArr.indexOf(keycode);
                var isCurrentDirection = keycodeIndex === keydownArr.length - 1;
                keydownArr.splice(keycodeIndex, 1);
                if (!isCurrentDirection) return;
                if (keydownArr.length > 0) {
                    _this2.emitDirectionChange({ direction: keydownArr[keydownArr.length - 1] });
                } else {
                    _this2.emitDirectionChange({ direction: "Center" });
                }
            });
        }
    }, {
        key: "emitDirectionChange",
        value: function emitDirectionChange(e) {
            this.onDirectionChange && this.onDirectionChange(e);
        }
    }, {
        key: "emitAction",
        value: function emitAction(e) {
            this.onAction && this.onAction(e);
        }
    }]);

    return GameControler;
}();

var Grid = function () {
    function Grid(props) {
        _classCallCheck(this, Grid);

        var options = Object.assign(defaultProps, props);
        this.self = null;
        this.players = [
            //Player
        ];
        this.materials = [
            //Material
        ];
        this.bubbles = [
            //Bubble
        ];
        this.col = options.col;
        this.row = options.row;
        this.size = options.size;
        this.w = window.innerWidth;
        this.h = window.innerHeight;
        this.app = new PIXI.Application({
            width: this.w,
            height: this.h,
            antialias: true,
            transparent: false,
            resolution: 1 // default: 1
        });
        document.body.appendChild(this.app.view);
        if (IsPC()) {
            this.platform = 'pc';
        } else {
            this.platform = 'ios';
        }
        this.initMap(options);
        this.initStartPage(options);
        this.initController();
        // //draw the grid for debug
        // let grid=new PIXI.Graphics();
        // grid.lineStyle(1,0x333333,1);
        // for(let i=0; i<this.col; i++){
        //     grid.moveTo(i*this.size,0);
        //     grid.lineTo(i*this.size,window.innerHeight);
        // }
        // for(let i=0; i<this.row; i++){
        //     grid.moveTo(0,i*this.size);
        //     grid.lineTo(window.innerWidth,i*this.size);
        // }
        // this.map.addChild(grid)
        // //end
    }

    _createClass(Grid, [{
        key: "initStartPage",
        value: function initStartPage(options) {
            var _this3 = this;

            var event = {
                click: 'click'
            };
            if (this.platform !== 'pc') {
                event = {
                    click: "tap"
                };
            }
            this.startPage = new PIXI.Container();
            var g = new PIXI.Sprite(new PIXI.Texture(PIXI.utils.TextureCache[res.start_page], new PIXI.Rectangle(0, 40, 800, 520)));
            g.width = window.innerWidth;
            g.height = window.innerHeight;
            var startButton = new PIXI.Sprite(new PIXI.Texture(PIXI.utils.TextureCache[res.start_button]));
            startButton.x = 100;
            startButton.y = window.innerHeight - 300;
            this.startPage.addChild(g);
            this.startPage.addChild(startButton);
            this.app.stage.addChild(this.startPage);
            startButton.interactive = true;
            startButton.on(event.click, function (event) {
                startButton.visible = false;
                notice("搜索房间中...");
                Server.emit("search_room", { id: pid, name: pname });
            });
            this.restartPage = new PIXI.Container();
            var restart = new PIXI.Sprite(new PIXI.Texture(PIXI.utils.TextureCache[res.restart_button]));
            this.restartPage.addChild(restart);
            restart.interactive = true;
            restart.on(event.click, function (event) {
                _this3.restartPage.visible = false;
                // this.self.restart()
                Server.emit("game_restart", { id: pid, name: pname });
            });
            this.restartPage.visible = false;
            this.app.stage.addChild(this.restartPage);
        }
    }, {
        key: "initMap",
        value: function initMap(options) {
            this.map = new PIXI.Container();
            this.map.width = this.w = options.width;
            this.map.height = this.h = options.height;
            this.map.x = (window.innerWidth - options.width) / 2;
            this.map.y = (window.innerHeight - options.height) / 2;
            this.app.stage.addChild(this.map);
            //add tile
            this.map.addChild(new PIXI.extras.TilingSprite(new PIXI.Texture(PIXI.utils.TextureCache[res.maptile], new PIXI.Rectangle(mapTile.xStart, mapTile.yStart + mapTile.step * 0, mapTile.step, mapTile.step)), this.size * this.col, this.size * this.row));
        }
    }, {
        key: "addSelf",
        value: function addSelf() {
            var _this4 = this;

            var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { id: Math.random, isSelf: true, col: 1, row: 1 };

            var player = void 0;
            player = new Player(data);
            player.addTo(this);
            this.self = player;
            player.onKillPlayer = function (player) {
                Server.emit("kill_player", { id: _this4.self.id, playerId: player.id });
            };
            player.onRealKillPlayer = function (player) {
                Server.emit("real_kill_player", { id: _this4.self.id, playerId: player.id });
            };
            player.onEatMedicine = function (medicine) {
                Server.emit("eat_medicine", { medicineId: medicine.id, id: player.id });
            };
        }
    }, {
        key: "add",
        value: function add(m) {
            var pixi = m.ele;
            this.map.addChild(pixi);
            if (m instanceof Player) {
                this.players.push(m);
            } else if (m instanceof Bubble) {
                this.bubbles.push(m);
            } else {
                this.materials.push(m);
            }
        }
    }, {
        key: "remove",
        value: function remove(m) {
            var pixi = m.ele;
            this.map.removeChild(pixi);
            if (m instanceof Player) {
                this.players.splice(this.players.indexOf(m), 1);
            } else if (m instanceof Bubble) {
                this.bubbles.splice(this.bubbles.indexOf(m), 1);
            } else {
                this.materials.splice(this.materials.indexOf(m), 1);
            }
        }
    }, {
        key: "clear",
        value: function clear() {
            this.players = [];
            this.materials = [];
            this.bubbles = [];
            this.map.removeChildren(1, this.map.children.length);
        }
    }, {
        key: "initController",
        value: function initController() {
            var _this5 = this;

            var move = null,
                currentDirection = Direction.DOWN;
            var ticker = this.ticker = new PIXI.ticker.Ticker();
            var playerMoving = {};
            var playerKeys = [];
            var roomId = -1;
            var stop = function stop() {
                move = null;
                _this5.self.stopWalk();
                Server.emit("stop_walk", Object.assign({}, _this5.normalizePos(_this5.self.x, _this5.self.y), { direction: _this5.self.direction }));
            };
            var start = function start() {
                _this5.self.faceTo(currentDirection);
                Server.emit("walk", Object.assign({}, _this5.normalizePos(_this5.self.x, _this5.self.y), { direction: _this5.self.direction }));
            };
            ticker.add(function (delta) {
                move && move();
                playerKeys.forEach(function (key) {
                    playerMoving[key] && playerMoving[key]();
                });
            });
            ticker.start();
            var controler = new GameControler({ platform: this.platform });
            controler.onDirectionChange = function (e) {
                if (_this5.self.state !== PlayerState.NORMAL) return;
                switch (e.direction) {
                    case 'ArrowLeft':
                        move = _this5.self.moveLeft;
                        currentDirection = Direction.LEFT;
                        start();
                        break;
                    case 'ArrowRight':
                        move = _this5.self.moveRight;
                        currentDirection = Direction.RIGHT;
                        start();
                        break;
                    case 'ArrowUp':
                        move = _this5.self.moveUp;
                        currentDirection = Direction.UP;
                        start();
                        break;
                    case 'ArrowDown':
                        move = _this5.self.moveDown;
                        currentDirection = Direction.DOWN;
                        start();
                        break;
                    case 'Center':
                        stop();
                        break;
                }
            };
            controler.onAction = function (e) {
                switch (e.action) {
                    case "CreateBubble":
                        var bubble = _this5.self.createBubble();
                        if (!bubble) return;
                        Server.emit("create_bubble", { id: _this5.self.id, col: bubble.col, row: bubble.row, bubbleId: bubble.id });
                        bubble.onDestroy = function () {
                            Server.emit("bubble_boom", { id: _this5.self.id, bubbleId: bubble.id });
                        };
                        break;
                }
            };
            Server.emit("join", { id: pid, name: pname });
            Server.on("player_walk", function (data) {
                var player = _this5.players.find(function (item) {
                    return item.id === data.id;
                });
                playerKeys = Object.keys(playerMoving);
                if (!player) return;
                player.faceTo(data.direction);
                player.update(g.unNormalizePos(data.x, data.y));
                switch (player.direction) {
                    case Direction.DOWN:
                        playerMoving[player.id] = player.moveDown;
                        break;
                    case Direction.LEFT:
                        playerMoving[player.id] = player.moveLeft;
                        break;
                    case Direction.RIGHT:
                        playerMoving[player.id] = player.moveRight;
                        break;
                    case Direction.UP:
                        playerMoving[player.id] = player.moveUp;
                        break;
                    default:
                        playerMoving[player.id] = null;
                }
            });
            Server.on("player_stop_walk", function (data) {
                var player = g.players.find(function (item) {
                    return item.id === data.id;
                });
                if (!player) return;
                player.faceTo(data.direction);
                player.update(_this5.unNormalizePos(data.x, data.y));
                player.stopWalk();
                playerMoving[player.id] = null;
            });
            Server.on("player_create_bubble", function (data) {
                var player = _this5.players.find(function (item) {
                    return item.id == data.id;
                });
                if (!player) return;
                player.createBubble(data.bubbleId, data.col, data.row);
            });
            Server.on("player_bubble_boom", function (data) {
                var player = _this5.players.find(function (item) {
                    return item.id == data.id;
                });
                if (!player) return;
                var bubble = player.bubbles.find(function (item) {
                    return item.id == data.bubbleId;
                });
                if (!bubble) return;
                bubble.boomNow();
            });
            Server.on("player_kill_player", function (data) {
                var player1 = _this5.players.find(function (item) {
                    return item.id == data.id;
                });
                var player2 = _this5.players.find(function (item) {
                    return item.id == data.playerId;
                });
                if (player1 && player2) {
                    player1.kill(player2);
                }
            });
            Server.on("player_real_kill_player", function (data) {
                var player1 = _this5.players.find(function (item) {
                    return item.id == data.id;
                });
                var player2 = _this5.players.find(function (item) {
                    return item.id == data.playerId;
                });
                if (player1 && player2) {
                    player1.realKill(player2);
                    if (player2 == _this5.self) {
                        // this.restartPage.visible=true;
                        notice(player1.name + " kill you!");
                    }
                }
            });
            Server.on("game_start", function (data) {
                _this5.startPage.visible = false;
                GameSound.play("readygo");
                GameSound.play("water", { loop: true });
                GameSound.pause("home");
            });
            Server.on("game_restart", function () {
                _this5.clear();
                Server.emit("join_room", { id: roomId });
            });
            Server.on("join_success", function (data) {
                notice("本机成功加入,等待玩家中...");
                loadMap(_this5, map, data.medicines);
                _this5.addSelf({ col: data.col, row: data.row, id: data.id, name: data.name, isSelf: true, team: data.team });
                if (_this5.platform !== 'pc') {
                    controler.attachDirectionControler(_this5.map, 40, _this5.map.height - 360);
                    controler.attachActionControler(_this5.map, _this5.map.width - 220, _this5.map.height - 260);
                }
                stop();
                roomId = data.roomId;
                //初始化 获取用户列表
                data.players.forEach(function (item) {
                    if (_this5.self.id != item.id) {
                        new Player(Object.assign({ id: item.id }, g.unNormalizePos(item.x, item.y), { name: item.name, team: item.team })).addTo(g);
                    }
                });
                Server.on("player_join", function (data) {
                    notice(data.name + " 加入房间");
                    new Player({ id: data.id, row: data.row, col: data.col, name: data.name, team: data.team }).addTo(_this5);
                });
            });
            Server.on("s_gameover", function (_ref) {
                var winner = _ref.winner;

                if (winner[0].team == _this5.self.team) {
                    notice("胜利");
                } else {
                    notice("失败");
                }
                _this5.restartPage.visible = true;
            });
            Server.on("player_restart", function (data) {
                notice(data.name + "复活");
                var player1 = _this5.players.find(function (item) {
                    return item.id == data.id;
                });
                if (player1) {
                    player1.restart();
                }
            });
            Server.on("player_leave", function (_ref2) {
                var id = _ref2.id;

                var player = _this5.players.find(function (item) {
                    return item.id == id;
                });
                if (player) {
                    notice(player.name + "离开房间");
                }
            });
            Server.on("player_eat_medicine", function (_ref3) {
                var id = _ref3.id,
                    medicineId = _ref3.medicineId;

                for (var i = 0, j = _this5.materials.length; i < j; i++) {
                    if (_this5.materials[i] && _this5.materials[i].id == medicineId) {
                        var _player = _this5.players.find(function (item) {
                            return item.id == id;
                        });
                        if (_player) {
                            _this5.materials[i].eatByPlayer(_player);
                        }
                        break;
                    }
                }
            });
        }
    }, {
        key: "getMaterialByColRow",
        value: function getMaterialByColRow(col, row) {
            var materials = [];
            for (var i = 0, l = this.materials.length; i < l; i++) {
                if (betweenRange(this.materials[i].col, col) && betweenRange(this.materials[i].row, row)) {
                    materials.push(this.materials[i]);
                }
            }
            for (var _i = 0, _l = this.bubbles.length; _i < _l; _i++) {
                if (betweenRange(this.bubbles[_i].col, col) && betweenRange(this.bubbles[_i].row, row)) {
                    materials.push(this.bubbles[_i]);
                }
            }
            for (var _i2 = 0, _l2 = this.players.length; _i2 < _l2; _i2++) {
                if (betweenRange(this.players[_i2].col, col) && betweenRange(this.players[_i2].row, row) && !this.players[_i2].isSelf) {
                    materials.push(this.players[_i2]);
                }
            }
            return materials;
        }
    }, {
        key: "debug",
        value: function debug(m) {
            var d = new PIXI.Graphics();
            d.lineStyle(1, 0xf1f100, 1);
            d.drawRect(m.x, m.y, m.w, m.h);
            this.map.addChild(d);
        }
    }, {
        key: "normalizePos",
        value: function normalizePos(x, y) {
            return {
                x: x / this.w,
                y: y / this.h
            };
        }
    }, {
        key: "unNormalizePos",
        value: function unNormalizePos(x, y) {
            return {
                x: x * this.w,
                y: y * this.h
            };
        }
    }]);

    return Grid;
}();

var Bound = function Bound(props) {
    _classCallCheck(this, Bound);

    this.x = props.x;
    this.y = props.y;
    this.w = props.w;
    this.h = props.h;
};
//网格中的物体


var Material = function (_Bound) {
    _inherits(Material, _Bound);

    function Material(props) {
        _classCallCheck(this, Material);

        var _this6 = _possibleConstructorReturn(this, (Material.__proto__ || Object.getPrototypeOf(Material)).call(this, props));

        _this6.col = props.col;
        _this6.row = props.row;
        _this6.destructible = props.destructible;
        _this6.passable = props.passable;
        _this6.z = props.z || 10;
        _this6.ele;
        _this6.grid;
        _this6.basicTexture = props.texture;
        _this6.destroyed = false;
        _this6.scalex = _this6.scaley = 0.9;
        _this6.offseth = 6;
        _this6.offsetw = 0;
        _this6.id = props.id || Math.random();
        _this6.onDestroy = null;
        return _this6;
    }

    _createClass(Material, [{
        key: "addTo",
        value: function addTo(grid) {
            this.grid = grid;

            var _calcSize = this.calcSize(),
                x = _calcSize.x,
                y = _calcSize.y,
                w = _calcSize.w,
                h = _calcSize.h;
            //如果指定了x，y


            if (!this.x) this.x = x;
            if (!this.y) this.y = y;
            this.w = w;
            this.h = h;
            this.ele = this.render();
            grid.add(this);
            this.afterRender();
        }
        //render后ele已初始化

    }, {
        key: "afterRender",
        value: function afterRender() {}
    }, {
        key: "calcSize",
        value: function calcSize() {
            var tileSize = this.grid.size;
            var xsize = tileSize * this.scalex;
            var ysize = tileSize * this.scaley;
            if (this.col == undefined || this.row == undefined) {
                var _getColRow2 = this.getColRow(),
                    col = _getColRow2.col,
                    row = _getColRow2.row;

                this.col = col;
                this.row = row;
            }
            return {
                x: this.col * tileSize + (tileSize - xsize) / 2,
                y: this.row * tileSize + (tileSize - ysize) / 2,
                w: xsize,
                h: ysize
            };
        }
        //模仿3d效果 绘图上移

    }, {
        key: "render",
        value: function render() {
            var g = new PIXI.Sprite(this.basicTexture);
            g.x = this.x - this.offsetw;
            g.y = this.y - this.offseth;
            g.width = this.w + this.offsetw;
            g.height = this.h + this.offseth;
            return g;
        }
    }, {
        key: "destroy",
        value: function destroy() {
            this.destroyed = true;
            this.destroyEle();
        }
    }, {
        key: "destroyEle",
        value: function destroyEle() {
            this.grid.remove(this);
            this.ele.destroy();
            this.onDestroy && this.onDestroy();
        }
    }, {
        key: "getColRow",
        value: function getColRow() {
            var _getColRow3 = _getColRow(this.x + this.w / 2, this.y + this.h / 2, this.grid.size),
                col = _getColRow3.col,
                row = _getColRow3.row;

            return { col: col, row: row };
        }
    }]);

    return Material;
}(Bound);
//for Player's Sprite


var x_start = 29,
    x_step = 100,
    y_start = 40,
    y_step = 100,
    w = 42,
    h = 60;

var Player = function (_Material) {
    _inherits(Player, _Material);

    function Player(props) {
        _classCallCheck(this, Player);

        var options = Object.assign({
            //Player
            speed: defaultProps.size / 10,
            direction: null,
            maxBubbleCount: 1,
            bubbleRadius: 1,
            state: PlayerState.NORMAL,
            passable: true
        }, props);

        var _this7 = _possibleConstructorReturn(this, (Player.__proto__ || Object.getPrototypeOf(Player)).call(this, options));

        _this7.speed = options.speed;
        _this7.direction = options.direction;
        _this7.maxBubbleCount = options.maxBubbleCount;
        _this7.bubbleRadius = options.bubbleRadius;
        _this7.team = options.team;
        _this7.bubbles = [
            //Bubble
        ];
        _this7.medicines = [];
        _this7.state = options.state;
        _this7.isSelf = props.isSelf || false;
        _this7.name = props.name;
        //绑定对象
        _this7.moveLeft = _this7.moveLeft.bind(_this7);
        _this7.moveRight = _this7.moveRight.bind(_this7);
        _this7.moveUp = _this7.moveUp.bind(_this7);
        _this7.moveDown = _this7.moveDown.bind(_this7);
        var src = '';
        switch (options.team) {
            case 'red':
                src = res.male_red_1;
                break;
            case 'blue':
                src = res.male_blue;
                break;
            case 'black':
                src = res.male_black;
                break;
            default:
                src = res.male_red_1;
        }
        _this7.basicTexture = PIXI.utils.TextureCache[src];
        _this7.scalex = 0.6;
        _this7.scaley = 0.7;
        _this7.onKillPlayer = null;
        _this7.onRealKillPlayer = null;
        _this7.onEatMedicine = null;
        return _this7;
    }

    _createClass(Player, [{
        key: "render",
        value: function render() {
            var g = new PIXI.extras.AnimatedSprite([this.getFrame(x_start, y_start, w, h)]);
            g.x = 0;
            g.y = 0;
            g.width = this.w + this.offsetw;
            g.height = this.h + this.offseth;
            g.animationSpeed = 0.2;
            g.loop = true;
            var container = new PIXI.Container();
            container.x = this.x - this.offsetw;
            container.y = this.y - this.offseth;
            var text = new PIXI.Text(this.name, { fontFamily: 'Arial', fontSize: 12, fill: 0xf5f500, align: 'center' });
            text.x = 0;
            text.y = -14;
            container.addChild(g);
            container.addChild(text);
            this.animateSprite = g;
            return container;
        }
    }, {
        key: "createBubble",
        value: function createBubble(id, icol, irow) {
            GameSound.play("uinormal");
            if (this.bubbles.length >= this.maxBubbleCount) return null;
            var colandrow = null;
            if (icol != undefined || irow != undefined) {
                colandrow = { col: icol, row: irow };
            } else {
                var _getColRow4 = _getColRow(this.x + this.w / 2, this.y + this.w / 2, this.grid.size),
                    col = _getColRow4.col,
                    row = _getColRow4.row;

                colandrow = { col: col, row: row };
            }
            var b = new Bubble({ col: colandrow.col, row: colandrow.row, player: this, id: id });
            this.bubbles.push(b);
            b.addTo(this.grid);
            return b;
        }
    }, {
        key: "deleteBubble",
        value: function deleteBubble(bubble) {
            this.bubbles.splice(this.bubbles.indexOf(bubble), 1);
            this.grid.remove(bubble);
        }
    }, {
        key: "getFrame",
        value: function getFrame(x, y, w, h) {
            var rectangle = new PIXI.Rectangle(x, y, w, h);
            var frame = new PIXI.Texture(this.basicTexture, rectangle);
            return frame;
        }
    }, {
        key: "stopWalk",
        value: function stopWalk() {
            this.animateSprite.stop();
        }
    }, {
        key: "faceTo",
        value: function faceTo(direction) {
            if (this.direction === direction) {
                this.animateSprite.play();
                return;
            }
            var yStart = y_start;
            this.direction = direction;
            switch (direction) {
                case Direction.DOWN:
                    break;
                case Direction.LEFT:
                    yStart = y_start + 1 * y_step;
                    break;
                case Direction.RIGHT:
                    yStart = y_start + 2 * y_step;
                    break;
                case Direction.UP:
                    yStart = y_start + 3 * y_step;
                    break;
            }
            var frameArray = [];
            for (var i = 0; i < 4; i++) {
                var frame = this.getFrame(x_start + i * x_step, yStart, w, h);
                frameArray.push(frame);
            }
            this.animateSprite.textures = frameArray;
            this.animateSprite.play();
        }
    }, {
        key: "leftTest",
        value: function leftTest() {
            var _this8 = this;

            var _getColRow5 = _getColRow(this.x + this.w / 2, this.y + this.h / 2, this.grid.size),
                col = _getColRow5.col,
                row = _getColRow5.row;

            this.col = col;
            this.row = row;
            var m = this.grid.getMaterialByColRow(col - 1, [row - 1, row + 1]);
            return m.filter(function (item) {
                return hitTestRectangle(item, _this8);
            });
        }
    }, {
        key: "rightTest",
        value: function rightTest() {
            var _this9 = this;

            var _getColRow6 = _getColRow(this.x + this.w / 2, this.y + this.h / 2, this.grid.size),
                col = _getColRow6.col,
                row = _getColRow6.row;

            this.col = col;
            this.row = row;
            var m = this.grid.getMaterialByColRow(col + 1, [row - 1, row + 1]);
            return m.filter(function (item) {
                return hitTestRectangle(item, _this9);
            });
        }
    }, {
        key: "upTest",
        value: function upTest() {
            var _this10 = this;

            var _getColRow7 = _getColRow(this.x + this.w / 2, this.y + this.h / 2, this.grid.size),
                col = _getColRow7.col,
                row = _getColRow7.row;

            this.col = col;
            this.row = row;
            var m = this.grid.getMaterialByColRow([col - 1, col + 1], row - 1);
            return m.filter(function (item) {
                return hitTestRectangle(item, _this10);
            });
        }
    }, {
        key: "downTest",
        value: function downTest() {
            var _this11 = this;

            var _getColRow8 = _getColRow(this.x + this.w / 2, this.y + this.h / 2, this.grid.size),
                col = _getColRow8.col,
                row = _getColRow8.row;

            this.col = col;
            this.row = row;
            var m = this.grid.getMaterialByColRow([col - 1, col + 1], row + 1);
            return m.filter(function (item) {
                return hitTestRectangle(item, _this11);
            });
        }
    }, {
        key: "moveLeft",
        value: function moveLeft() {
            var _this12 = this;

            this.x -= this.speed;
            var hit = this.leftTest();
            if (hit.some(function (item) {
                _this12.checkHit(item);
                return !item.passable;
            })) {
                this.x += this.speed;
                return;
            }
            this.ele.x = this.x - this.offsetw;
        }
    }, {
        key: "moveRight",
        value: function moveRight() {
            var _this13 = this;

            this.x += this.speed;
            var hit = this.rightTest();
            if (hit.some(function (item) {
                _this13.checkHit(item);
                return !item.passable;
            })) {
                this.x -= this.speed;
                return;
            }
            this.ele.x = this.x - this.offsetw;
        }
    }, {
        key: "moveUp",
        value: function moveUp() {
            var _this14 = this;

            this.y -= this.speed;
            var hit = this.upTest();
            if (hit.some(function (item) {
                _this14.checkHit(item);
                return !item.passable;
            })) {
                this.y += this.speed;
                return;
            }
            this.ele.y = this.y - this.offseth;
        }
    }, {
        key: "moveDown",
        value: function moveDown() {
            var _this15 = this;

            this.y += this.speed;
            var hit = this.downTest();
            if (hit.some(function (item) {
                _this15.checkHit(item);
                return !item.passable;
            })) {
                this.y -= this.speed;
                return;
            }
            this.ele.y = this.y - this.offseth;
        }
    }, {
        key: "changeState",
        value: function changeState(state) {
            var _this16 = this;

            this.state = state;
            switch (state) {
                case PlayerState.FALL:
                    this.ele.children[0].alpha = 0.5;
                    break;
                case PlayerState.DIE:
                    var frames = [new PIXI.Texture(PIXI.utils.TextureCache[res.playerfall1]), new PIXI.Texture(PIXI.utils.TextureCache[res.playerfall2]), new PIXI.Texture(PIXI.utils.TextureCache[res.playerfall3]), new PIXI.Texture(PIXI.utils.TextureCache[res.playerfall4]), new PIXI.Texture(PIXI.utils.TextureCache[res.playerfall5])];
                    var _b = new PIXI.extras.AnimatedSprite(frames);
                    _b.animationSpeed = 0.2;
                    _b.loop = true;
                    _b.width = this.w + this.offsetw;
                    _b.height = this.h + this.offseth;
                    _b.play();
                    this.ele.addChild(_b);
                    setTimeout(function () {
                        _this16.ele.removeChildren();
                    }, 500);
                    break;
            }
        }
        //击倒

    }, {
        key: "kill",
        value: function kill(player) {
            player.changeState(PlayerState.FALL);
            this.onKillPlayer && this.onKillPlayer(player);
        }
        //击杀

    }, {
        key: "realKill",
        value: function realKill(player) {
            player.changeState(PlayerState.DIE);
            GameSound.play("playerboom");
            this.onRealKillPlayer && this.onRealKillPlayer(player);
        }
    }, {
        key: "restart",
        value: function restart() {
            this.state = PlayerState.NORMAL;
            this.ele.scale = new PIXI.Point(1, 1);
        }
    }, {
        key: "checkHit",
        value: function checkHit(material) {
            if (!this.isSelf) return;
            if (material instanceof Medicine) {
                material.eatByPlayer(this);
                this.onEatMedicine && this.onEatMedicine(material);
            } else if (material instanceof Player) {
                if (material.state === PlayerState.FALL) {
                    this.realKill(material);
                }
            }
        }
    }, {
        key: "update",
        value: function update(data) {
            this.x = data.x;
            this.y = data.y;
            this.ele.x = this.x - this.offsetw;
            this.ele.y = this.y - this.offseth;

            var _getColRow9 = _getColRow(this.x + this.w / 2, this.y + this.h / 2, this.grid.size),
                col = _getColRow9.col,
                row = _getColRow9.row;

            this.col = col;
            this.row = row;
        }
    }]);

    return Player;
}(Material);
//阻碍


var Stone = function (_Material2) {
    _inherits(Stone, _Material2);

    function Stone(props) {
        _classCallCheck(this, Stone);

        var options = Object.assign({
            destructible: true,
            passable: false
        }, props);

        var _this17 = _possibleConstructorReturn(this, (Stone.__proto__ || Object.getPrototypeOf(Stone)).call(this, options));

        _this17.basicTexture = props.texture;
        _this17.scalex = _this17.scaley = 1;
        return _this17;
    }

    return Stone;
}(Material);
//遮挡物


var Mask = function (_Material3) {
    _inherits(Mask, _Material3);

    function Mask(props) {
        _classCallCheck(this, Mask);

        var options = Object.assign({
            destructible: false,
            passable: true
        }, props);

        var _this18 = _possibleConstructorReturn(this, (Mask.__proto__ || Object.getPrototypeOf(Mask)).call(this, options));

        _this18.basicTexture = new PIXI.Texture(PIXI.utils.TextureCache[res.maptile2], new PIXI.Rectangle(61, 0, 62, 70));
        return _this18;
    }

    return Mask;
}(Material);
//泡


var Bubble = function (_Material4) {
    _inherits(Bubble, _Material4);

    function Bubble(props) {
        _classCallCheck(this, Bubble);

        var options = Object.assign({
            destructible: true,
            passable: false,
            duration: 3
        }, props);

        var _this19 = _possibleConstructorReturn(this, (Bubble.__proto__ || Object.getPrototypeOf(Bubble)).call(this, options));

        _this19.player = options.player;
        _this19.duration = options.duration;
        _this19.basicTexture = PIXI.utils.TextureCache[res.bubble_normal];
        _this19.isSelfs = _this19.player === _this19.player.grid.self;
        if (_this19.isSelfs) {
            _this19.timeout = setTimeout(function () {
                _this19.boom();
            }, _this19.duration * 1000);
        }
        _this19.boomed = false;
        return _this19;
    }
    //@overide 重写，被气球击中会触发boom


    _createClass(Bubble, [{
        key: "destroyEle",
        value: function destroyEle() {
            //击中其他玩家的气球不会触发
            if (!this.isSelfs) return;
            this.boomNow();
        }
    }, {
        key: "render",
        value: function render() {
            var g = new PIXI.Container();
            var frames = [new PIXI.Texture(this.basicTexture, new PIXI.Rectangle(16, 18, 45, 47)), new PIXI.Texture(this.basicTexture, new PIXI.Rectangle(85, 18, 45, 47)), new PIXI.Texture(this.basicTexture, new PIXI.Rectangle(155, 18, 48, 47)), new PIXI.Texture(this.basicTexture, new PIXI.Rectangle(85, 18, 45, 47))];
            var s = new PIXI.extras.AnimatedSprite(frames);
            s.animationSpeed = 0.06;
            s.loop = true;
            s.play();
            g.addChild(s);
            g.x = this.x - this.offsetw;
            g.y = this.y - this.offseth;
            g.width = s.width = this.w + this.offsetw;
            g.height = s.width = this.h + this.offseth;
            return g;
        }
        //boom without timeout

    }, {
        key: "boomNow",
        value: function boomNow() {
            if (this.boomed) return;
            clearTimeout(this.timeout);
            this.boom();
        }
    }, {
        key: "boom",
        value: function boom() {
            var _this20 = this;

            this.onDestroy && this.onDestroy();
            this.boomed = true; //boom必须提前与calcBoomBound 否则死循环
            GameSound.play("bubbleboom");
            this.drawBoom();
            setTimeout(function () {
                _this20.player.deleteBubble(_this20);
            }, 500);
        }
        //绘制爆炸效果

    }, {
        key: "drawBoom",
        value: function drawBoom() {
            var g = this.ele;
            g.removeChildren();
            var bound = this.calcBoomBound();
            var tileSize = this.player.grid.size;
            var texture = PIXI.utils.TextureCache[res.bubble_yellow_boom];
            var txS = 56;
            var tyS = 64;
            var left = new PIXI.Sprite(new PIXI.Texture(texture, new PIXI.Rectangle(txS * 2, 0, txS + 1, tyS))),
                right = new PIXI.Sprite(new PIXI.Texture(texture, new PIXI.Rectangle(txS * 3, 0, txS - 1, tyS))),
                up = new PIXI.Sprite(new PIXI.Texture(texture, new PIXI.Rectangle(txS * 0, 0, txS, tyS - 8))),
                down = new PIXI.Sprite(new PIXI.Texture(texture, new PIXI.Rectangle(txS * 1 + 1, 0, txS, tyS))),
                row = new PIXI.extras.TilingSprite(new PIXI.Texture(texture, new PIXI.Rectangle(txS * 4, 0, txS, tyS)), bound[0].w - 2 * tileSize, tyS),
                col = new PIXI.extras.TilingSprite(new PIXI.Texture(texture, new PIXI.Rectangle(txS * 6 - 1, 0, txS, tyS - 10)), txS, bound[1].h - 2 * tileSize);
            left.x = bound[0].x;
            left.y = bound[0].y;
            right.x = bound[0].x + bound[0].w - tileSize;
            right.y = bound[0].y;
            up.x = bound[1].x;
            up.y = bound[1].y;
            down.x = bound[1].x;
            down.y = bound[1].y + bound[1].h - tileSize;
            row.x = left.x + tileSize;
            row.y = left.y;
            col.x = up.x;
            col.y = up.y + tileSize;
            left.width = right.width = tileSize;
            up.height = down.height = tileSize;
            g.addChild.apply(g, [left, row, right, up, down, col]);
            // //for debug
            //    let s=new PIXI.Graphics();
            //    s.lineStyle(1,0xf1f1f1);
            //    s.drawRect(up.x,up.y,up.width,up.height)
            //    s.drawRect(col.x,col.y,col.width,col.height)
            //    s.drawRect(down.x,down.y,down.width,down.height)
            //    s.drawRect(left.x,left.y,left.width,left.height)
            //    s.drawRect(row.x,row.y,row.width,row.height)
            //    s.drawRect(right.x,right.y,right.width,right.height)
            //    s.drawRect(bound[0].x,bound[1].y,bound[0].w,bound[1].h)
            //    g.addChild(s)
        }
        //计算爆炸区域

    }, {
        key: "calcBoomBound",
        value: function calcBoomBound() {
            var _this21 = this;

            var bubbleRadius = this.player.bubbleRadius;
            var tileSize = this.player.grid.size;
            var rowMaterial = this.player.grid.getMaterialByColRow([this.col - bubbleRadius, this.col + bubbleRadius], this.row);
            var colMaterial = this.player.grid.getMaterialByColRow(this.col, [this.row - bubbleRadius, this.row + bubbleRadius]);
            var left = { col: this.col - bubbleRadius - 1, row: this.row },
                right = { col: this.col + bubbleRadius + 1, row: this.row },
                up = { col: this.col, row: this.row - bubbleRadius - 1 },
                down = { col: this.col, row: this.row + bubbleRadius + 1 };
            rowMaterial.forEach(function (item) {
                if (item.passable) return;
                if (item.col < _this21.col) {
                    if (item.col > left.col) {
                        left = item;
                    }
                } else if (item.col > _this21.col) {
                    if (item.col < right.col) {
                        right = item;
                    }
                }
            });
            colMaterial.forEach(function (item) {
                if (item.passable) return;
                if (item.row < _this21.row) {
                    if (item.row > up.row) {
                        up = item;
                    }
                } else if (item.row > _this21.row) {
                    if (item.row < down.row) {
                        down = item;
                    }
                }
            });
            var leftCol = left.col + 1;
            var rightCol = right.col - 1;
            var upRow = up.row + 1;
            var downRow = down.row - 1;
            //check if hit players or stones
            //should not test if it's player is not self
            if (this.isSelfs) {
                var players = this.player.grid.players;
                players.forEach(function (player) {
                    if (player.row === left.row && player.col >= leftCol && player.col <= rightCol || player.col === up.col && player.row >= upRow && player.row <= downRow) {
                        _this21.player.kill(player);
                    }
                });
            }
            var arr = [left, right, up, down];
            arr.forEach(function (m) {
                if (m.destructible) {
                    m.destroy();
                    if (m == left) {
                        leftCol -= 1;
                    } else if (m == right) {
                        rightCol += 1;
                    } else if (m == up) {
                        upRow -= 1;
                    } else {
                        downRow += 1;
                    }
                }
            });
            //end
            return [new Bound({
                x: (leftCol - this.col) * tileSize,
                y: 0,
                w: (rightCol - leftCol + 1) * tileSize,
                h: tileSize
            }), new Bound({
                x: 0,
                y: (upRow - this.row) * tileSize,
                w: tileSize,
                h: (downRow - upRow + 1) * tileSize
            })];
        }
    }]);

    return Bubble;
}(Material);

var Medicine = function (_Material5) {
    _inherits(Medicine, _Material5);

    // container:Stone;
    function Medicine(props) {
        _classCallCheck(this, Medicine);

        // this.container=props.container;
        // this.row=props.row;
        // this.col=props.col;
        // this.z=this.container.z-1;
        var _this22 = _possibleConstructorReturn(this, (Medicine.__proto__ || Object.getPrototypeOf(Medicine)).call(this, Object.assign({
            destructible: false,
            passable: true
        }, props)));

        _this22.scalex = 0.6;
        _this22.scaley = 0.7;
        return _this22;
    }

    _createClass(Medicine, [{
        key: "eatByPlayer",
        value: function eatByPlayer(player) {
            GameSound.play("eat");
            this.destroy();
            this.changePlayerAttr(player);
        }
    }, {
        key: "changePlayerAttr",
        value: function changePlayerAttr(player) {}
    }]);

    return Medicine;
}(Material);

var AddSpeed = function (_Medicine) {
    _inherits(AddSpeed, _Medicine);

    function AddSpeed(props) {
        _classCallCheck(this, AddSpeed);

        var _this23 = _possibleConstructorReturn(this, (AddSpeed.__proto__ || Object.getPrototypeOf(AddSpeed)).call(this, props));

        _this23.basicTexture = new PIXI.Texture(PIXI.utils.TextureCache[res.medicine], new PIXI.Rectangle(0, 0, 32, 64));
        return _this23;
    }
    //overide   


    _createClass(AddSpeed, [{
        key: "changePlayerAttr",
        value: function changePlayerAttr(player) {
            player.speed += 1;
            notice("移动速度增加");
        }
    }]);

    return AddSpeed;
}(Medicine);

var AddBubble = function (_Medicine2) {
    _inherits(AddBubble, _Medicine2);

    function AddBubble(props) {
        _classCallCheck(this, AddBubble);

        var _this24 = _possibleConstructorReturn(this, (AddBubble.__proto__ || Object.getPrototypeOf(AddBubble)).call(this, props));

        _this24.basicTexture = new PIXI.Texture(PIXI.utils.TextureCache[res.medicine], new PIXI.Rectangle(0, 0, 32, 64));
        return _this24;
    }
    //overide   


    _createClass(AddBubble, [{
        key: "changePlayerAttr",
        value: function changePlayerAttr(player) {
            player.maxBubbleCount += 1;
            notice("泡泡数量增加");
        }
    }]);

    return AddBubble;
}(Medicine);

var AddBubbleRadius = function (_Medicine3) {
    _inherits(AddBubbleRadius, _Medicine3);

    function AddBubbleRadius(props) {
        _classCallCheck(this, AddBubbleRadius);

        var _this25 = _possibleConstructorReturn(this, (AddBubbleRadius.__proto__ || Object.getPrototypeOf(AddBubbleRadius)).call(this, props));

        _this25.basicTexture = new PIXI.Texture(PIXI.utils.TextureCache[res.medicine], new PIXI.Rectangle(0, 0, 32, 64));
        return _this25;
    }
    //overide   


    _createClass(AddBubbleRadius, [{
        key: "changePlayerAttr",
        value: function changePlayerAttr(player) {
            player.bubbleRadius += 1;
            notice("泡泡范围增加");
        }
    }]);

    return AddBubbleRadius;
}(Medicine);

var Server = {
    socket: null,
    init: function init(callback) {
        var socket = Server.socket;
    },
    emit: function emit(type, data) {
        var socket = Server.socket;
        socket.emit(type, data);
    },
    on: function on(type, callback) {
        Server.socket.on(type, callback);
    }
};
//rectangle hit test
function hitTestRectangle(r1, r2) {
    //Define the variables we'll need to calculate
    var hit = void 0,
        combinedHalfWidths = void 0,
        combinedHalfHeights = void 0,
        vx = void 0,
        vy = void 0;
    //hit will determine whether there's a collision
    hit = false;
    //Find the center points of each sprite
    r1.centerX = r1.x + r1.w / 2;
    r1.centerY = r1.y + r1.h / 2;
    r2.centerX = r2.x + r2.w / 2;
    r2.centerY = r2.y + r2.h / 2;
    //Find the half-widths and half-heights of each sprite
    r1.halfWidth = r1.w / 2;
    r1.halfHeight = r1.h / 2;
    r2.halfWidth = r2.w / 2;
    r2.halfHeight = r2.h / 2;
    //Calculate the distance vector between the sprites
    vx = r1.centerX - r2.centerX;
    vy = r1.centerY - r2.centerY;
    //Figure out the combined half-widths and half-heights
    combinedHalfWidths = r1.halfWidth + r2.halfWidth;
    combinedHalfHeights = r1.halfHeight + r2.halfHeight;
    //Check for a collision on the x axis
    if (Math.abs(vx) < combinedHalfWidths) {
        //A collision might be occuring. Check for a collision on the y axis
        if (Math.abs(vy) < combinedHalfHeights) {
            //There's definitely a collision happening
            hit = true;
        } else {
            //There's no collision on the y axis
            hit = false;
        }
    } else {
        //There's no collision on the x axis
        hit = false;
    }
    //`hit` will be either `true` or `false`
    return hit;
}
;
//get col and row by centerx,centery and tile's size
function _getColRow(x, y, size) {
    return {
        col: Math.floor(x / size), row: Math.floor(y / size)
    };
}
//check value between range
function betweenRange(value, range) {
    if (Array.isArray(range)) {
        if (value <= range[1] && value >= range[0]) {
            return true;
        }
    } else {
        if (value === range) {
            return true;
        }
    }
    return false;
}
function toggleFullScreen(ele) {
    if (!document.mozFullScreen && !document.webkitIsFullScreen) {
        if (ele.mozRequestFullScreen) {
            ele.mozRequestFullScreen();
        } else {
            ele.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    } else {
        if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else {
            document.webkitExitFullscreen();
        }
    }
}
function IsPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}
//load image resource
function loadRes(callback) {
    var resource = Object.keys(res).map(function (key) {
        return res[key];
    });
    var length = 0;
    GameSound.load(function () {
        PIXI.loader.add(resource).load(callback);
    });
}
//start the game
var g = null;
var player = null;
//
var noticeEle = new PIXI.Container();
var text = new PIXI.Text();
var noticeTimeout = null;
text.style.padding = 10;
text.style.align = "center";
text.style.fill = 0xffffff;
text.visible = false;
noticeEle.addChild(text);
function start(socket) {
    Server.socket = socket;
    loadRes(function () {
        // let stone=new Stone({row:5,col:5})
        // new Medicine1({container:stone}).addTo(g)
        // stone.addTo(g);
        GameSound.play("home", { loop: true });
        pid = parseInt(String(Math.random() * 1000));
        pname = prompt("name:", "Player " + pid);
        g = new Grid({});
        g.app.stage.addChild(noticeEle);
    });
}
function loadMap(g, map, medicines) {
    var base = 41;
    var texture = {
        box: new PIXI.Texture(PIXI.utils.TextureCache[res.maptile2], new PIXI.Rectangle(0, 0, 60, 68)),
        box1: new PIXI.Texture(PIXI.utils.TextureCache[res.maptile2], new PIXI.Rectangle(61, 0, 60, 68)),
        box2: new PIXI.Texture(PIXI.utils.TextureCache[res.maptile2], new PIXI.Rectangle(122, 0, 60, 68)),
        box3: new PIXI.Texture(PIXI.utils.TextureCache[res.maptile2], new PIXI.Rectangle(183, 0, 60, 68)),
        s1: new PIXI.Texture(PIXI.utils.TextureCache[res.maptile3], new PIXI.Rectangle(base * 0, 0, base, 52)),
        s2: new PIXI.Texture(PIXI.utils.TextureCache[res.maptile3], new PIXI.Rectangle(base * 1, 0, base, 52)),
        s3: new PIXI.Texture(PIXI.utils.TextureCache[res.maptile3], new PIXI.Rectangle(base * 2, 0, base, 52)),
        s4: new PIXI.Texture(PIXI.utils.TextureCache[res.maptile4], new PIXI.Rectangle(160, 180, base, 60)),
        s5: new PIXI.Texture(PIXI.utils.TextureCache[res.maptile4], new PIXI.Rectangle(200, 180, base, 60)),
        s6: new PIXI.Texture(PIXI.utils.TextureCache[res.maptile4], new PIXI.Rectangle(240, 180, base, 60)),
        s7: new PIXI.Texture(PIXI.utils.TextureCache[res.maptile4], new PIXI.Rectangle(280, 180, base, 60)),
        s8: new PIXI.Texture(PIXI.utils.TextureCache[res.maptile4], new PIXI.Rectangle(320, 180, base, 60)),
        s9: new PIXI.Texture(PIXI.utils.TextureCache[res.maptile4], new PIXI.Rectangle(340, 180, base, 60)),
        t1: new PIXI.Texture(PIXI.utils.TextureCache[res.maptile5], new PIXI.Rectangle(0, 0, 85, 82)),
        t2: new PIXI.Texture(PIXI.utils.TextureCache[res.maptile5], new PIXI.Rectangle(85, 0, 85, 66)),
        t3: new PIXI.Texture(PIXI.utils.TextureCache[res.maptile5], new PIXI.Rectangle(170, 0, 75, 73)),
        t4: new PIXI.Texture(PIXI.utils.TextureCache[res.maptile5], new PIXI.Rectangle(245, 0, 59, 78)),
        t5: new PIXI.Texture(PIXI.utils.TextureCache[res.maptile5], new PIXI.Rectangle(364, 0, 62, 75)),
        t6: new PIXI.Texture(PIXI.utils.TextureCache[res.maptile5], new PIXI.Rectangle(425, 0, 63, 80)),
        t7: new PIXI.Texture(PIXI.utils.TextureCache[res.maptile5], new PIXI.Rectangle(198, 84, 63, 58)),
        t8: new PIXI.Texture(PIXI.utils.TextureCache[res.maptile5], new PIXI.Rectangle(69, 341, 67, 64)),
        t9: new PIXI.Texture(PIXI.utils.TextureCache[res.maptile5], new PIXI.Rectangle(0, 245, 64, 75))
    };
    map.forEach(function (item, index) {
        var _getColRowByIndex = getColRowByIndex(index, 18),
            col = _getColRowByIndex.col,
            row = _getColRowByIndex.row;

        if (col == 0) {
            new Stone({ col: col - 1, row: row, texture: texture.box3, destructible: false }).addTo(g);
        } else if (col == 17) {
            new Stone({ col: col + 1, row: row, texture: texture.box3, destructible: false }).addTo(g);
        } else if (row == 0) {
            new Stone({ col: col, row: row - 1, texture: texture.box3, destructible: false }).addTo(g);
        } else if (row == 9) {
            new Stone({ col: col, row: row + 1, texture: texture.box3, destructible: false }).addTo(g);
        }
        //add Medicine if have
        if (medicines[index] && item) {
            if (medicines[index].eat) return;
            switch (medicines[index].medicine) {
                case 'add_speed':
                    new AddSpeed({ id: medicines[index].id, col: col, row: row }).addTo(g);
                    break;
                case 'add_bubble':
                    new AddBubble({ id: medicines[index].id, col: col, row: row }).addTo(g);
                    break;
                case 'add_bubble_radius':
                    new AddBubbleRadius({ id: medicines[index].id, col: col, row: row }).addTo(g);
                    break;
            }
        }
        switch (item) {
            case z:
                new Stone({ col: col, row: row, texture: texture.s2, destructible: false }).addTo(g);
                break;
            case x:
                new Stone({ col: col, row: row, texture: texture.t1, destructible: false }).addTo(g);
                break;
            case a:
                new Stone({ col: col, row: row, texture: texture.box2 }).addTo(g);
                break;
            case b:
                new Stone({ col: col, row: row, texture: texture.s1 }).addTo(g);
                break;
            case c:
                new Stone({ col: col, row: row, texture: texture.box3 }).addTo(g);
                break;
            case d:
                new Stone({ col: col, row: row, texture: texture.t9 }).addTo(g);
                break;
            case e:
                new Stone({ col: col, row: row, texture: texture.t8 }).addTo(g);
                break;
        }
    });
}
function getColRowByIndex(index, mCol) {
    var col = 0,
        row = 0;
    if (index != 0) {
        col = ((index + 1) % mCol || mCol) - 1;
    } else {
        col = (index + 1) % mCol - 1;
    }
    row = (index + 1) % mCol == 0 ? (index + 1) / mCol - 1 : Math.floor((index + 1) / mCol);
    return { col: col, row: row };
}
function notice(str) {
    text.text = str;
    text.visible = true;
    clearTimeout(noticeTimeout);
    noticeTimeout = setTimeout(function () {
        text.visible = false;
    }, 3000);
}

/***/ }),
/* 2 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getTarget = function (target) {
  return document.querySelector(target);
};

var getElement = (function (fn) {
	var memo = {};

	return function(target) {
                // If passing function in options, then use it for resolve "head" element.
                // Useful for Shadow Root style i.e
                // {
                //   insertInto: function () { return document.querySelector("#foo").shadowRoot }
                // }
                if (typeof target === 'function') {
                        return target();
                }
                if (typeof memo[target] === "undefined") {
			var styleTarget = getTarget.call(this, target);
			// Special case to return head of iframe instead of iframe itself
			if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[target] = styleTarget;
		}
		return memo[target]
	};
})();

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(2);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton && typeof options.singleton !== "boolean") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
        if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	if(options.attrs.type === undefined) {
		options.attrs.type = "text/css";
	}

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	if(options.attrs.type === undefined) {
		options.attrs.type = "text/css";
	}
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 4 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(0);

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(3)(content, options);

if(content.locals) module.exports = content.locals;

if(true) {
	module.hot.accept(0, function(__WEBPACK_OUTDATED_DEPENDENCIES__) { (function() {
		var newContent = __webpack_require__(0);

		if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];

		var locals = (function(a, b) {
			var key, idx = 0;

			for(key in a) {
				if(!b || a[key] !== b[key]) return false;
				idx++;
			}

			for(key in b) idx--;

			return idx === 0;
		}(content.locals, newContent.locals));

		if(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');

		update(newContent);
	})(__WEBPACK_OUTDATED_DEPENDENCIES__); });

	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _src_game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _src_game__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_src_game__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _main_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5);
/* harmony import */ var _main_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_main_css__WEBPACK_IMPORTED_MODULE_1__);


const socket = io('http://67.216.197.160:3003');
// const socket = io('http://10.10.71.238:3003');


_src_game__WEBPACK_IMPORTED_MODULE_0___default.a.start(socket)

 




/***/ })
/******/ ]);