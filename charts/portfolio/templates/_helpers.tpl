{{/*
Expand the name of the chart.
*/}}
{{- define "portfolio.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
Truncated at 63 chars because some Kubernetes name fields are limited to this.
*/}}
{{- define "portfolio.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "portfolio.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Selector labels shared by all components.
*/}}
{{- define "portfolio.selectorLabels" -}}
app.kubernetes.io/name: {{ include "portfolio.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/* ---------------------------------------------------------------------------
Frontend helpers
--------------------------------------------------------------------------- */}}

{{/*
Fully qualified name for the frontend component.
*/}}
{{- define "portfolio.frontend.fullname" -}}
{{- printf "%s-frontend" (include "portfolio.fullname" .) | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Frontend selector labels (include the component label so the two Deployments
select disjoint sets of Pods).
*/}}
{{- define "portfolio.frontend.selectorLabels" -}}
{{ include "portfolio.selectorLabels" . }}
app.kubernetes.io/component: frontend
{{- end }}

{{/*
Frontend common labels.
*/}}
{{- define "portfolio.frontend.labels" -}}
helm.sh/chart: {{ include "portfolio.chart" . }}
{{ include "portfolio.frontend.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
The frontend ServiceAccount name.
*/}}
{{- define "portfolio.frontend.serviceAccountName" -}}
{{- if .Values.frontend.serviceAccount.create }}
{{- default (include "portfolio.frontend.fullname" .) .Values.frontend.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.frontend.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
The frontend image reference, defaulting the tag to the chart appVersion.
*/}}
{{- define "portfolio.frontend.image" -}}
{{- $tag := .Values.frontend.image.tag | default .Chart.AppVersion -}}
{{- printf "%s:%s" .Values.frontend.image.repository $tag -}}
{{- end }}

{{/* ---------------------------------------------------------------------------
Backend helpers
--------------------------------------------------------------------------- */}}

{{/*
Fully qualified name for the backend component.
*/}}
{{- define "portfolio.backend.fullname" -}}
{{- printf "%s-backend" (include "portfolio.fullname" .) | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Backend selector labels.
*/}}
{{- define "portfolio.backend.selectorLabels" -}}
{{ include "portfolio.selectorLabels" . }}
app.kubernetes.io/component: backend
{{- end }}

{{/*
Backend common labels.
*/}}
{{- define "portfolio.backend.labels" -}}
helm.sh/chart: {{ include "portfolio.chart" . }}
{{ include "portfolio.backend.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
The backend ServiceAccount name.
*/}}
{{- define "portfolio.backend.serviceAccountName" -}}
{{- if .Values.backend.serviceAccount.create }}
{{- default (include "portfolio.backend.fullname" .) .Values.backend.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.backend.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
The backend image reference, defaulting the tag to the chart appVersion.
*/}}
{{- define "portfolio.backend.image" -}}
{{- $tag := .Values.backend.image.tag | default .Chart.AppVersion -}}
{{- printf "%s:%s" .Values.backend.image.repository $tag -}}
{{- end }}

{{/*
Name of the ConfigMap holding the backend's non-sensitive configuration.
*/}}
{{- define "portfolio.backend.configMapName" -}}
{{- printf "%s-config" (include "portfolio.backend.fullname" .) | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Name of the Secret the backend loads env from. Resolution order:
  1. an explicit existingSecret,
  2. the ExternalSecret target name,
  3. the backend fullname (the default ExternalSecret target).
*/}}
{{- define "portfolio.backend.secretName" -}}
{{- if .Values.backend.existingSecret -}}
{{- .Values.backend.existingSecret -}}
{{- else if .Values.backend.externalSecret.target.name -}}
{{- .Values.backend.externalSecret.target.name -}}
{{- else -}}
{{- include "portfolio.backend.fullname" . -}}
{{- end -}}
{{- end }}

{{/*
Whether the backend should load env from a Secret (envFrom secretRef).
*/}}
{{- define "portfolio.backend.usesSecret" -}}
{{- if or .Values.backend.existingSecret .Values.backend.externalSecret.enabled -}}
true
{{- end -}}
{{- end }}

{{/* ---------------------------------------------------------------------------
Cache (DragonflyDB) helpers
--------------------------------------------------------------------------- */}}

{{/*
Name of the Dragonfly resource (and the Service the operator creates for it).
*/}}
{{- define "portfolio.cache.name" -}}
{{- if .Values.cache.name -}}
{{- .Values.cache.name | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- printf "%s-cache" (include "portfolio.fullname" .) | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end }}

{{/*
Cache common labels (set on the Dragonfly custom resource's metadata).
*/}}
{{- define "portfolio.cache.labels" -}}
helm.sh/chart: {{ include "portfolio.chart" . }}
app.kubernetes.io/name: {{ include "portfolio.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/component: cache
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}
