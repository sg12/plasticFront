import { SupportReplies } from "./SupportReplies"
import { SupportForm } from "./SupportForm"

export const Support = () => {
  return (
    <div className="space-global">
      <div>
        <h2>Поддержка</h2>
        <p className="mt-2 text-gray-600">Свяжитесь с нами для получения помощи</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="space-global lg:col-span-2">
          {/* <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-600" />
                Часы работы
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-child text-sm">
                {WORKING_HOURS.days.map((day, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-gray-600">{day}</span>
                    <span>{WORKING_HOURS.hours[index]}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card> */}

          <SupportForm />
        </div>

        <div className="space-global lg:col-span-2">
          {/* <Card>
            <CardHeader>
              <CardTitle>Способы связи</CardTitle>
            </CardHeader>
            <CardContent className="space-child">
              {CONTACT_METHODS.map((method) => {
                const Icon = iconMap[method.icon as keyof typeof iconMap]
                return (
                  <div key={method.type} className="flex items-center gap-3">
                    <div className="rounded-lg bg-purple-50 p-2">
                      <Icon className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-normal">{method.label}</p>
                      <p className="text-sm text-gray-600">{method.value}</p>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card> */}

          <SupportReplies />
        </div>
      </div>
    </div>
  )
}
