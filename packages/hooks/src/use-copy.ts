import { useMemo, useState, useCallback } from 'react'


interface UseCopyReturn {
  copy: CopyFn
  copiedText: CopiedValue
}

type CopiedValue = string | null

type CopyFn = (text: string) => Promise<boolean>

const useCopy = (): UseCopyReturn => {
  const [copiedText, setCopiedText] = useState<CopiedValue>(null)

  const copy: CopyFn = useCallback(
    async (text) => {
      if (!navigator?.clipboard) {
        console.warn('Clipboard not supported')
        return false
      }

      try {
        await navigator.clipboard.writeText(text)
        setCopiedText(text)
        return true
      } catch (error) {
        console.warn('Copy failed', error)
        setCopiedText(null)
        return false
      }
    },
    []
  )

  const memoizedValue = useMemo(() => ({ copy, copiedText }), [copy, copiedText])

  return memoizedValue
}

export default useCopy
